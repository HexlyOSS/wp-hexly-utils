<?php


class HX_Dynamic_Coupon {
  public function __construct() {
    add_filter('woocommerce_get_shop_coupon_data', [$this, 'filter_woocommerce_get_shop_coupon_data'], 10, 2);
    add_action('woocommerce_thankyou', [$this, 'action_woocommerce_thankyou']);
    add_action('woocommerce_removed_coupon', [$this, 'action_woocommerce_removed_coupon']);
  }

  function filter_woocommerce_get_shop_coupon_data($filtered, $data){
    // we only run this logic if there's nothing found yet
    if ( $filtered !== false ) {
      return $filtered;
    }

    // if the passed info isn't just a string, we're out
    if( !is_string($data) ){
      return $filtered;
    }

    $code = $data;

    $details = $this->search_hexly_for_coupon($data);
    if( empty($details) ){
      return $filtered;
    }

    if( $details->status !== 'ISSUED' ){
      Hexly::info("Unexpected status; not applying $code", $details);
      return $filtered;
    }


    try {
      $result = $this->parse_details($code, $details);
      return $result;
    }catch(Throwable $err){
      Hexly::warn("Failed parsing coupon $code: " . $err->getMessage(), $details, $err);
      return $filtered;
    }
  }

  private function search_hexly_for_coupon($code){
    global $hexly_fed_graphql;
    try {
      $res = $hexly_fed_graphql->exec(self::QUERY, [ 'input' => [ 'code' => $code ] ]);
      // handle error?
      $res = $res->marketing->couponByCode ?? null;
      return empty($res) ? null : $res;
    } catch (\Throwable $th) {
      Hexly::panic('Graphql Error!', $th);
    }
  }

  private function parse_details($code, $details) {
    $result = [
      'code' => $details->code,
      'date_created' => null,
      'date_modified' => null,
      'date_expires' => null,
      'discount_type' => 'fixed_cart',
      'description' => 'description',
      'usage_count' => 0,
      'individual_use' => false,
      'product_ids' => array(),
      'excluded_product_ids' => array(),
      'usage_limit' => 0,
      'usage_limit_per_user' => 1,
      'limit_usage_to_x_items' => null,
      'free_shipping' => false,
      'product_categories' => array(),
      'excluded_product_categories' => array(),
      'exclude_sale_items' => false,
      'minimum_amount' => '',
      'maximum_amount' => '',
      'email_restrictions' => array(),
      'used_by' => array(),
      'virtual' => false
    ];

    switch($details->type){
      case 'FIXED_CART_AMOUNT':
        $currency = 'USD'; // TODO @narfdre
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
        $options = $details->config->options ?? [];
        $tid = get_option('hexly_wp_auth_integration_id') ?? 'not-found';
        $def = array_filter($options, function($o) use ($tid) {
          return $o->tenantIntegrationId == $tid;
        });
        Hexly::info('need to handle', $def, $tid); // tODO start here
        break;

      default:
        throw new Error('Could not handle coupon type for ' . $code);
    }

    return $result;
  }

  function action_woocommerce_removed_coupon($coupon_code) {
    Hexly::info('action_woocommerce_removed_coupon() $coupon_code', $coupon_code);
    // TODO: Send message to hexly that the coupon code was not used? (May not be necessary)
  }

  const QUERY = <<<QUERY
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

}

new HX_Dynamic_Coupon();