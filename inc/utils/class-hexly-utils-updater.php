<?php
class HexlyUtilsAutoUpdater {

  function __construct(){
    add_action('init', [$this, 'hexly_utils_auto_update']);
  }

  function hexly_utils_auto_update(){
    $plugins = apply_filters('hexly_utils_auto_update', []);

    foreach($plugins as $p){
      [$url, $path, $name] = $p;
      Hexly::debug('registering plugin for auto-update', [$url, $path, $name]);
      $checker = Puc_v4_Factory::buildUpdateChecker($url, $path, $name);
      $current = $checker->getInstalledVersion();
      $is_local = is_numeric(strpos($current, '__build-number__'));

      if( $is_local && !defined('HEXLY_LOCAL_UPDATE_FORCE_ENABLED') ){
        $checker->resetUpdateState();
        add_filter( $checker->getUniqueName('request_update_result'), function($obj){
          Hexly::debug('rejecting local update', $obj);
          return null;
        }, 1, 1);
      }
    }
  }
}

new HexlyUtilsAutoUpdater();
?>
