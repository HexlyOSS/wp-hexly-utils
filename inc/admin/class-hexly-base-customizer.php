<?php 

// Base Class 
class HexlyCustomizerModule {

  protected $title;
  protected $panel;
  protected $prefix;
  protected $module;
  protected $settings;

  function __construct($arr, $prefix=null, $module=null){
    if( is_array($arr) ){
      ['prefix' => $prefix, 'module' => $module, 'panel' => $panel] = $arr;
      $this->panel = $panel;
    }else{
      $this->title = $arr;
    }
    $this->settings = "{$prefix}_{$module}";
    $this->$prefix = $prefix;
    $this->module = $module;
  }

  function init() {
    add_action("customize_register", [$this, "customize_register"]);
    add_action('after_setup_theme', [$this, 'do_register_controls']);
  }


  function get_theme_mod_key($section, $key=null){
    $value = $this->settings . '_' . $section;
    if( !empty($key) ){
      $value = $value . "[$key]";
    }
    return $value;
  }

  function get($section, $key, $type=null){
    $token = $this->settings . '_' . $section;
    $mod = get_theme_mod($token);
    if( empty($mod) ){
      $mod = get_option($token);
    }
    // check options if not found in theme mods?

    $value = empty($mod) ?  null : $mod[$key];

    if( is_serialized($stored) ){
      $value = unserialize($stored);
    }

    Hexly::info("getting $token $type");

    if( $type == 'object' ){
      $value = empty($value) ? new stdClass() : (object) $value;
    }else if($type == 'array' ){
      $value = empty($value) ? [] : (array) $value;
    }

    return $value;
  }

  function register_controls($hexly_customizer){ }

  final function do_register_controls(){
    global $hexly_customizer;
    $this->register_controls($hexly_customizer);
  }

}