<?php


class HX_Dynamic_Coupon {
  public function __construct() {
    add_filter('woocommerce_get_shop_coupon_data', [$this, 'filter_woocommerce_get_shop_coupon_data'], 10, 2);
    add_action('woocommerce_thankyou', [$this, 'action_woocommerce_thankyou']);
    add_action('woocommerce_removed_coupon', [$this, 'action_woocommerce_removed_coupon']);
  }

  function filter_woocommerce_get_shop_coupon_data($false, $data){
    if ($false || !$data) {
      return false;
    }
    global $hexly_fed_graphql;

    try {
      $res = $hexly_fed_graphql->exec(<<<QUERY
        query couponSearch(\$input: CouponSearchInput!) {
          comp {
            couponSearch(input: \$input) {
              id
              amount
              code
              expiration
            }
          }
        }
      QUERY, [ 'input' => [ 'code' => $data ] ]);
      $res_data = $res->comp->couponSearch;
      $res_is_empty = empty($res_data);

      if ($res_is_empty) {
        Hexly::warn('No coupon data found!', $res);
        return false;
      }
    } catch (\Throwable $th) {
      echo $th->xdebug_message;
      Hexly::panic('Graphql Error!');
    }

    $new_coupon = [
      'code' => $res_data->code,
      'amount' => $res_data->amount,
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

    return $new_coupon;
  }

  function action_woocommerce_thankyou($order_id) {
    global $hexly_fed_graphql;

    $order_just_processed = new WC_Order($order_id);
    $order_coupons = $order_just_processed->get_coupons();
    $order_coupon_codes = [];
    foreach ($order_coupons as $coupon) {
      array_push($order_coupon_codes, $coupon->get_code());
    }

    $no_codes_used = empty($order_coupon_codes);
    if ($no_codes_used) {
      return;
    }

    try {
      $res = $hexly_fed_graphql->exec(<<<QUERY
        mutation couponUsed(\$input: CouponUsedInput!) {
          comp {
            couponUsed(input: \$input) {
              id
              amount
              code
              expiration
            }
          }
        }
      QUERY, [ 'input' => [ 'codes' => $order_coupon_codes ] ]);
    } catch (\Throwable $th) {
      echo $th->xdebug_message;
      Hexly::panic('Graphql mutation Error!');
    }
  }

  function action_woocommerce_removed_coupon($coupon_code) {
    Hexly::info('action_woocommerce_removed_coupon() $coupon_code', $coupon_code);
    // TODO: Send message to hexly that the coupon code was not used? (May not be necessary)
  }

}

new HX_Dynamic_Coupon();