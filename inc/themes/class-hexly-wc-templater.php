<?php

class HexlyWcTemplater {

  const PATHS_FILTER_KEY = 'hexly_utils_wc_templater_paths';
  const SHOULD_OVERRIDE_TEMPLATE_FILTER_KEY = 'hexly_utils_wc_templater_should_override_template';
  const SHOULD_OVERRIDE_PART_FILTER_KEY = 'hexly_utils_wc_templater_should_override_part';

  function __construct() {
    add_filter( 'woocommerce_locate_template', [$this, 'locate_template'], 10, 3 );
    add_filter('wc_get_template_part', [$this, 'wc_get_template_part'], 10, 3);
  }

  static function add_path($path){
    add_filter( self::PATHS_FILTER_KEY, function($paths) use ($path){
      return array_merge( [ $path ], $paths );
    }, 10, 1);
  }

  function locate_template( $template, $template_name, $template_path ) {
    global $woocommerce;

    $_template = $template;

    if ( ! $template_path ) {
      $template_path = $woocommerce->template_url;
    }

    $paths = apply_filters( self::PATHS_FILTER_KEY, [] );
    foreach( $paths as $path ){
      $plugin_path  = $path . 'templates/woocommerce/';
      $target = $plugin_path . $template_name;
      $exists = file_exists( $target );

      $should_use = apply_filters( self::SHOULD_OVERRIDE_TEMPLATE_FILTER_KEY, $exists, $target, $template );

      if( $should_use ){
        return $target;
      }
    }

    $default_path = [$template_path . $template_name, $template_name];

    return $template;
  }

  public function wc_get_template_part($template, $slug, $name) {
    global $post;

    $paths = apply_filters( self::PATHS_FILTER_KEY, [] );
    foreach( $paths as $path ){
      $plugin_path  = $path . 'templates/woocommerce/';
      $target = $plugin_path . "$slug-$name.php";
      $exists = file_exists( $target );

      $should_use = apply_filters( self::SHOULD_OVERRIDE_PART_FILTER_KEY, $exists, $target, $template, $slug, $name, $path );
      if( $should_use ){
        return $target;
      }
    }
    return $template;
  }

}
new HexlyWcTemplater();