<?php

class HexlyAdminUi {

  function __construct(){
		add_filter('woocommerce_screen_ids', [$this, 'include_woo_assets_on_hexly_screens']);
		add_filter( 'is_protected_meta', [$this, 'is_protected_meta'], 999, 1 );



		add_action('admin_enqueue_scripts', [$this, 'enqueue_scripts']);


  }

	function enqueue_scripts(){
		if (is_admin()) {
			wp_enqueue_script('jquery-ui-datepicker');
			wp_register_style('jquery-ui', '//ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css');
			wp_enqueue_style('jquery-ui');

			wp_enqueue_script('hx-utils-js', HEXLY_UTIL_PLUGIN_URL . 'assets/admin/js/hx-utils.js');
			wp_enqueue_style('hx-utils-css', HEXLY_UTIL_PLUGIN_URL . 'assets/admin/css/hx-utils.css');
		}
	}

	function is_protected_meta($value){
		if( is_admin() ){
			return false;
		}
		return $value;
	}

	function include_woo_assets_on_hexly_screens($ids){
		$screen       = get_current_screen();
		$screen_id    = $screen ? $screen->id : '';
		if( strpos($screen_id, 'hexly_') !== false){
			$ids[] = $screen_id;
		}
		return $ids;
	}

}

new HexlyAdminUi();
