<?php
class HexlyUtilsAutoUpdater {

  function __construct(){
    add_action('wp', [$this, 'hexly_utils_auto_update']);
  }

  function hexly_utils_auto_update(){
    $plugins = apply_filters('hexly_utils_auto_update', []);

    foreach($plugins as $p){
      [$url, $path, $name] = $p;
      Hexly::debug('registering plugin for auto-update', [$url, $path, $name]);
      Puc_v4_Factory::buildUpdateChecker($url, $path, $name);
    }
  }
}

new HexlyUtilsAutoUpdater();




?>
