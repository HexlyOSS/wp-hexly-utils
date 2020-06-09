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
      self::$instance = new HexlyUtilsPlugin();
    }
    return self::$instance;
  }

  function __construct() {
    $this->register_dependencies();
    $this->early_register();
    add_action( 'plugins_loaded', [$this, 'standard_register']);
  }

  function register_dependencies(){
    require 'vendor/autoload.php';
  }

  function early_register(){
    require_once(HEXLY_UTIL_PLUGIN_PATH . 'inc/class-hexly.php');
    require_once(HEXLY_UTIL_PLUGIN_PATH . 'inc/utils/class-hexly-parse-utils.php');
    require_once(HEXLY_UTIL_PLUGIN_PATH . 'inc/admin/class-hexly-customizer.php');
    require_once(HEXLY_UTIL_PLUGIN_PATH . 'inc/themes/class-hexly-wc-templater.php');
  }

  function standard_register(){
    require_once(HEXLY_UTIL_PLUGIN_PATH . 'inc/graphql/class-hexly-graphql-handlers.php');
    require_once(HEXLY_UTIL_PLUGIN_PATH . 'inc/graphql/class-hexly-graphql-types.php');
    require_once(HEXLY_UTIL_PLUGIN_PATH . 'inc/utils/class-hexly-utils-updater.php');
    require_once(HEXLY_UTIL_PLUGIN_PATH . 'inc/admin/class-hexly-roles.php'); // TODO clean me up!
    // most things can be done here
  }

}

add_action( 'plugins_loaded', [ 'HexlyUtilsPlugin', 'get_instance' ], 1 );

// Version: 123