<?php
/*
Plugin Name: Hexly Utils
Description:
Version: 0.1.__build-number__
*/

require_once(ABSPATH . 'wp-admin/includes/plugin.php');
define( 'HEXLY_UTIL_PLUGIN_FILE', __FILE__);
define( 'HEXLY_UTIL_PLUGIN_VERSION', get_plugin_data(__FILE__)['Version'] );
define( 'HEXLY_UTIL_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'HEXLY_UTIL_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );

class HexlyUtilsPlugin {
  private static $instance;
  public static function get_instance() {
    if ( null == self::$instance ) {
      try {
        self::$instance = new HexlyUtilsPlugin();
      }catch(Throwable $err){
        error_log( "Failed loading plugin: \n" . print_r($err, true));
        add_action('admin_notices', function() use ($err){
          echo '<div class="error notice">';
          echo '<p>' . _e( 'Hexly Utils encountered an error: ', 'hexly' ). $err->getMessage() . '</p>';
          echo '</div>';
        });
        return null;
      }
    }
    return self::$instance;
  }

  function __construct() {
    $this->register_dependencies();
    $this->early_register();
    add_action( 'plugins_loaded', [$this, 'standard_register']);
    add_filter( 'hexly_utils_auto_update', [$this, 'autoupdater']);
    add_action( 'woocommerce_data_stores', [$this, 'init_data_stores']);
  }

  function init_data_stores ( $data_stores ) {
    $data_stores['order-item-hx_order_item_discount'] = 'HX_Order_Item_Discount_Data_Store';
    return $data_stores;
  }

  function autoupdater($arr){
    $arr[] = [
      'https://s3-us-west-2.amazonaws.com/plugins.hexly.cloud/wp/plugins/wp-hexly-utils/update-meta.json',
      HEXLY_UTIL_PLUGIN_FILE,
      'wp-hexly-utils'
    ];
    return $arr;
  }

  function register_dependencies(){
    require 'vendor/autoload.php';
  }

  function early_register(){
    require_once(HEXLY_UTIL_PLUGIN_PATH . 'inc/class-hexly.php');
    require_once(HEXLY_UTIL_PLUGIN_PATH . 'inc/queries/class-hx-wc-query-overrides.php');
    require_once(HEXLY_UTIL_PLUGIN_PATH . 'inc/audit/class-hx-audit-config.php');
    require_once(HEXLY_UTIL_PLUGIN_PATH . 'inc/coupons/class-hx-dynamic-coupon.php');
    require_once(HEXLY_UTIL_PLUGIN_PATH . 'inc/coupons/class-hx-gift-item-coupon.php');
    require_once(HEXLY_UTIL_PLUGIN_PATH . 'inc/orders/items/class-hx-order-item-discount.php');
    require_once(HEXLY_UTIL_PLUGIN_PATH . 'inc/utils/class-hx-wp-plugin.php');
    require_once(HEXLY_UTIL_PLUGIN_PATH . 'inc/utils/class-hexly-utils-updater.php');
    require_once(HEXLY_UTIL_PLUGIN_PATH . 'inc/utils/class-hexly-parse-utils.php');
    require_once(HEXLY_UTIL_PLUGIN_PATH . 'inc/utils/class-hexly-scheduler.php');
    require_once(HEXLY_UTIL_PLUGIN_PATH . 'inc/themes/class-hexly-generic-sidebars.php');
    require_once(HEXLY_UTIL_PLUGIN_PATH . 'inc/admin/class-hexly-customizer.php');
    require_once(HEXLY_UTIL_PLUGIN_PATH . 'inc/admin/configs/abstract-hx-custom-post-type-admin-config.php');
    require_once(HEXLY_UTIL_PLUGIN_PATH . 'inc/themes/class-hexly-wc-templater.php');
    require_once(HEXLY_UTIL_PLUGIN_PATH . 'inc/admin/class-hexly-admin-ui.php');
  }

  function standard_register(){
    require_once(HEXLY_UTIL_PLUGIN_PATH . 'inc/payments/class-hx-payment-gateway-visibility.php');
    require_once(HEXLY_UTIL_PLUGIN_PATH . 'inc/graphql/class-hexly-graphql-handlers.php');
    require_once(HEXLY_UTIL_PLUGIN_PATH . 'inc/graphql/class-hexly-graphql-types.php');
    require_once(HEXLY_UTIL_PLUGIN_PATH . 'inc/admin/class-hexly-roles.php'); // TODO clean me up!
    require_once(HEXLY_UTIL_PLUGIN_PATH . 'inc/admin/tables/class-hx-list-table.php');
    // most things can be done here

    add_filter( HexlyWcTemplater::PATHS_FILTER_KEY, function($paths){
      return array_merge( [ HEXLY_UTIL_PLUGIN_PATH ], $paths );
    }, 10, 1);
  }
}

add_action( 'plugins_loaded', [ 'HexlyUtilsPlugin', 'get_instance' ], 1 );