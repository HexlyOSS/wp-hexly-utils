<?php

class HexlyAdminUi {

  function __construct(){
		add_filter( 'is_protected_meta', [$this, 'is_protected_meta'], 999, 1 );
  }

	function is_protected_meta($value){
		if( is_admin() ){
			return false;
		}
		return $value;
	}

}

new HexlyAdminUi();
