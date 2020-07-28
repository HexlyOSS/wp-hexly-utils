<?php

require_once(ABSPATH . 'wp-admin/includes/plugin.php');
class HX_WP_Plugin {

  private static $details_cache = null;
  private static $last_instance = null;
  private static $instance_cache = [];

  private $plugin;

  static function init_plugin($PLUGIN, $bootstrap, $bv, $activation = false){
    $plugin = preg_replace('/(.*)\/wp-hexly-(.*).php/', '$1/class-hx-$2-plugin.php', $bootstrap);

    self::$details_cache = [
      'bootstrap' => $bootstrap,
      'prefix' => $PLUGIN,
      'file' => $plugin,
      'details' => get_plugin_data($bootstrap),
      'url' => plugin_dir_url( $bootstrap ),
      'path' => plugin_dir_path( $bootstrap ),
    ];
    include_once( $plugin );
    self::$details_cache = null;
    $instance = self::$last_instance;

    if( $instance ){
      if( $activation ){
        $instance->on_activate();
      }
      self::$last_instance = null;
    }
  }

  final function __construct(){
    $class = get_class($this);
    if( array_key_exists($class, self::$instance_cache) ){
      Hexly::warn("Found multiple instances of $class plugin; this should never happen!");
      throw new Exception('Should not ever let this happen!');
    }else{
      self::$instance_cache[$class] = $this;
      self::$last_instance = $this;
    }

    $this->plugin = (object) self::$details_cache;
    $this->init();
  }

  function init(){
    $this->auto_include();
  }

  function auto_include(){
    foreach( ($this->includes ?? []) as $include ){
      include_once( $this->get_path() . $include);
    }
  }

  function on_activate(){}

  function auto_update($key){
    $bootstrap = $this->plugin->bootstrap;
    add_filter( 'hexly_utils_auto_update', function($results) use ($key, $bootstrap){
      $results[] = [ "https://s3-us-west-2.amazonaws.com/plugins.hexly.cloud/wp/plugins/$key/update-meta.json", $bootstrap, $key ];
      return $results;
    });
  }

  function data_stores($stores) {
    return $stores;
  }

  function get_path(){
    return $this->plugin->path;
  }

  function get_url(){
    return $this->plugin->url;
  }

  function include_templates(){
    HexlyWcTemplater::add_path($this->get_path());
  }

  public static function __callStatic($name, $args){
    $class = get_called_class();
    $instance = self::$instance_cache[$class] ?? null;
    if( empty($instance) ){
      Hexly::warn('Could not find plugin instance for ' . $class);
      return;
    }

    $method = "get_$name";
    return $instance->$method(...$args);
  }

}