<?php


class HX_Dynamic_Coupon {

  const META_DETAILS_KEY = '_hx_dynamic_coupon';

  public function __construct() {
    add_filter('woocommerce_get_shop_coupon_data', [$this, 'get_dynamic_coupon'], 10, 3);
    // add_action('woocommerce_thankyou', [$this, 'action_woocommerce_thankyou']);
    add_action('woocommerce_removed_coupon', [$this, 'action_woocommerce_removed_coupon']);

    add_action( 'woocommerce_after_checkout_validation', [$this, 'enforce_validation'], 10, 2);
    add_action( 'woocommerce_checkout_order_processed', [$this, 'consume_coupon'], 10, 3);
  }

  function enforce_validation($fields, $errors){
    // useful for debugging early validation
    // $errors->add( 'validation', 'Fail me!' );
    $errors = $this->find_coupon_errors(WC()->cart->get_applied_coupons() ?? [], 'redeemed', null);
    foreach($errors as $key => $err ) {
      $errors->add( $key, $err );
    }
  }

  function consume_coupon($order_id, $posted_data, $order){
    $errors = $this->find_coupon_errors($order->get_coupon_codes() ?? [], 'redeemed', $order);
    if( $errors ){
      Hexly::info("Failing order ${order_id} because of dynamic hexly coupons", ['failed_order_id' => $order_id ], $errors);
      throw new Error('still fail');
    }

  }


  private function find_coupon_errors($codes, $operation, $order=null ){
    $errors = [];

    foreach ($codes as $code) {
      $coupon = new WC_Coupon( $code );
      $meta = $coupon->get_meta(self::META_DETAILS_KEY, true);
      if( empty($meta) ){
        continue;
      }

      try {
        $attempt = $this->gql_redeem_hexly_coupon($code, $order);
        if( empty($attempt) || !$attempt->success ){
          $errors["_hx_dynamic_coupon_{$operation}_rejected: . $code"] = `Coupon "$code" could not be $operation.`;
          $this->clear_cached($code);
        }
      }catch(Throwable $th){
        Hexly::info("Failed {$operation} dynamic coupon $code", $th);
        $errors["_hx_dynamic_coupon_{$operation}_failed"] = `Coupon(s) failed to be $operation; please contact support.`;
        $errors["_hx_dynamic_coupon_{$operation}_failed: . $code"] = `Coupon "$code" failed to be $operation correctly.`;
        $this->clear_cached($code);
      }
    }

    return $errors;
  }


  function get_dynamic_coupon($filtered, $data, $coupon){
    if( is_admin() ){
	    return $filtered;
    }
    if( defined('HX_DYNAMIC_COUPON_DISBALED') ){
      return $filtered;
    }

    // we only run this logic if there's nothing found yet
    if ( $filtered !== false ) {
      return $filtered;
    }


    // if the passed info isn't just a string, we're out
    if( !is_string($data) ){
      return $filtered;
    }

    $code = $data;

    $details = $this->search_for_coupon($data);
    if( empty($details) ){
      return $filtered;
    }

    if( $details->status !== 'ISSUED' ){
      Hexly::info("Unexpected status; not applying $code", $details);
      return $filtered;
    }


    try {
	    $result = $this->parse_details($code, $details, $coupon);
      return empty($result) ? $filtered : $result;
    }catch(Throwable $err){
      Hexly::warn("Failed parsing coupon $code: " . $err->getMessage(), $details, $err);
      return $filtered;
    }
  }

  private function search_for_coupon($code){
    if( !WC()->session ) {
      Hexly::warn('Could not find session to cache coupon info.');
      return $this->gql_search_hexly_for_coupon($code);
    }


    $prefix = WC()->session->get('_hx_coupon_sid');
    if( empty($prefix) ){
      $prefix = wp_generate_uuid4();
      WC()->session->set('_hx_coupon_sid', $prefix);
    }



    $token = "$prefix:coupon_cache:$code";
    $cached = get_transient($token);
    if( empty($cached) ){
	    $cached = $this->gql_search_hexly_for_coupon($code);
      if( !empty($cached) ){
        $timeout = 60 * 2;
        set_transient($token, $cached, $timeout);
      }
    // } else {
	    // Hexly::info('cache hit', $cached);
    }
    return $cached;
  }

  private function parse_details($code, $details, $coupon) {
    $result = [
      'code' => $details->code,
      'date_created' => null,
      'date_modified' => null,
      'date_expires' => null,
      'discount_type' => 'fixed_cart',
      'description' => 'description',
      'usage_count' => 0,
      'individual_use' => false,
      'product_ids' => array(),
      'excluded_product_ids' => array(),
      'usage_limit' => 0,
      'usage_limit_per_user' => 1,
      'limit_usage_to_x_items' => null,
      'free_shipping' => false,
      'product_categories' => array(),
      'excluded_product_categories' => array(),
      'exclude_sale_items' => false,
      'minimum_amount' => '',
      'maximum_amount' => '',
      'email_restrictions' => array(),
      'used_by' => array(),
      'virtual' => false
    ];

    switch($details->type){
      case 'FIXED_CART_AMOUNT':
        $currency = 'USD'; // default
        if( class_exists('WCPBC_Pricing_Zones') ){
          $current_zone = wcpbc()->current_zone;
          if(!empty($current_zone)){
            $currency = strtoupper($current_zone->get_currency()); // Normalizing just in case
          }
        }
        $currency_mod = .01; // normalize from pennies
        $currency_dec = 2; // round to the nearest 2 dec
        $amount = $details->config->amounts->$currency ?? null;

        if( !is_numeric($amount) ){
          throw new Error("Invalid amount for coupon code $code in currency $currency", $details);
        }

        $result['discount_type'] = 'fixed_cart';
        $result['amount'] = round($amount * $currency_mod, $currency_dec);
        break;

      case 'FREE_PRODUCT':
        // gift-item-coupon actually processes the thing
        $options = $details->config->options ?? [];
        $tid = $this->get_tid();
        [$def] = array_filter($options, function($o) use ($tid) {
          return $o->tenantIntegrationId == $tid;
        });
        if( empty($def) ){
          throw new Error('This coupon is not configured for a product in this store.');
        }else{
          $coupon = apply_filters('_hx_dynamic_coupon_process_free_product', $coupon, $def->productOid, $details);
        }
        break;

      default:
        throw new Error('Could not handle coupon type for ' . $code);
    }

    $coupon->read_manual_coupon($code, $result);
    $coupon->update_meta_data(self::META_DETAILS_KEY, $details);
    $coupon = apply_filters('_hx_dynamic_coupon_processed', $coupon, $details);
    return $coupon;
  }

  function action_woocommerce_removed_coupon($code){
      $this->clear_cached($code);
  }

  private function clear_cached($code) {
    if( !WC()->session ) {
      return;
    }


    $prefix = WC()->session->get('_hx_coupon_sid');
    if( empty($prefix) ){
      return;
    }

    $token = "$prefix:coupon_cache:$code";
    delete_transient($token);
  }

  private function gql_search_hexly_for_coupon($code){
    global $hexly_fed_graphql;
    try {
      $tid = $this->get_tid();
      $res = $hexly_fed_graphql->exec(self::QUERY_CODE, [ 'input' => [ 'code' => $code, 'tenantIntegrationId' => $tid ] ]);
      // handle error?
      $res = $res->marketing->couponByCode ?? null;
      $no_result = empty($res->code ?? null);
      return $no_result ? null : $res;
    } catch (\Throwable $th) {
      Hexly::panic('Graphql Error!', $th);
    }
  }


  private function gql_redeem_hexly_coupon($code, $order = null){
    global $hexly_fed_graphql;
    try {
      $metadata = new stdClass();
      if( !empty($order) ){
        $cid = $order->get_customer_id();
        if( !empty($cid) ){
          $metadata->customerOid = $cid;
        }
      }
      $res = $hexly_fed_graphql->exec(self::MUTATION_REDEEM, [ 'input' => [
        'dryRun' => empty($order),
        'code' => $code,
        'tenantIntegrationId' => $this->get_tid(),
        'integrationOid' => empty($order) ? null : "{$order->get_id()}",
        'metadata' => $metadata
      ] ]);
      // handle error?
      $res = $res->marketing->couponRedeem ?? null;
      return empty($res) ? null : $res;
    } catch (\Throwable $th) {
      Hexly::panic('Graphql Error!', $th);
    }
  }

  private function get_tid(){
    return intval(get_option('hexly_wp_auth_integration_id')) ?? 'not-found';
  }

  const QUERY_CODE = <<<QUERY
      query couponByCode(\$input: CouponSearchInput!) {
        marketing {
          couponByCode(input: \$input) {
            id
            type
            status
            config
            metadata
            code
            expiresOn
          }
        }
      }
  QUERY;

  const MUTATION_REDEEM = <<<QUERY
    mutation(\$input: CouponRedemptionInput!) {
      marketing {
        couponRedeem (input: \$input) {
          success
          message
          error
          metadata
        }
      }
    }
  QUERY;

}

new HX_Dynamic_Coupon();