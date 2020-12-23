<?php

class HX_Payment_Gateway_Visibility {

  const FIELD = 'hx_pgw_vis_hide_on';
  const VISIBILITY_KEY = 'visibility';

  private $data = null;

  private $options = [
    'checkout' => 'Checkout',
    'account_methods' => 'My Account > Payment Methods',
  ];

  function __construct(){
    add_filter('woocommerce_payment_gateways_setting_columns', [$this, 'add_admin_columns']);
    add_filter('woocommerce_available_payment_gateways', [$this, 'filter_gateways_visible'], 999);
    add_action('woocommerce_payment_gateways_setting_column_' . self::VISIBILITY_KEY, [$this, 'render_column']);
    add_action('pre_update_option_woocommerce_gateway_order', [$this, 'process_save'], 10, 3);
  }

  function add_admin_columns($cols){
    $result = [];
    foreach($cols as $key => $value ){
      $result[$key] = $value;
      if( $key === 'status' ){
        $result['visibility'] = 'Visibility';
      }
    }

    return $result;
  }

  function filter_gateways_visible($gateways){
    $relevant = array_filter( array_keys($this->options), function($opt){
      if( $opt === 'checkout' && is_checkout() ){
        return true;
      }else if($opt === 'account_methods' && is_account_page() ){
        return true;
      }
      return false;
    });

    foreach($relevant as $scope ){
      foreach ($gateways as $id => $gw) {
        if( $this->is_hidden($id, $scope) ){
          unset($gateways[$id]);
        }
      }
    }

    // Hexly::info('gateways?', array_keys($gateways), $relevant);

    return $gateways;
  }

  private function get_settings(){
    if( $this->data === null ){
      $data = get_option(self::FIELD, null);
      if( $data === null ){
        $this->data = false;
      }else{
        $this->data = json_decode($data);
      }
    }
    return $this->data === false ? null : $this->data;
  }

  private function is_hidden($gateway_id, $option){
    $settings = $this->get_settings();
    if( empty($settings) ){
      return false;
    }

    $hidden = $settings->$option ?? [];
    return in_array($gateway_id, $hidden);
  }

  function render_column($gateway){

    $settings = $this->get_settings();

    echo '<td style="min-width: 120px">';
    foreach ($this->options as $key => $title) {
      $handler = function( $field, $k, $args, $value ) use( $gateway, $settings, $key ) {
        $optional = '&nbsp;<span class="optional">(' . esc_html__( 'optional', 'woocommerce' ) . ')</span>';
        $field = str_replace( $optional, '', $field );

        $cb = 'value="1"';
        $replace = 'value="' . esc_attr($gateway->id) . '" ';

        // check the box is this is hidden
        if( $this->is_hidden( $gateway->id, $key ) ){
          $replace .= ' checked="checked" ';
        }

        $field = str_replace( $cb, $replace, $field );
        return $field;
      };
      add_filter( 'woocommerce_form_field' , $handler, 10, 4 );

      $args = [
        'type'          => 'checkbox',
        'class'         => array('input-checkbox'),
        'label'         => __($title),
        'value'         => $gateway->id
      ];

      if( false ){
        $args['checked'] = 'checked';
      }
      woocommerce_form_field( self::FIELD . "[$key][]", $args);
      remove_filter( 'woocommerce_form_field' , $handler, 10, 4 );
    }
    echo "</td>";
  }

  function process_save($old_value, $value, $option){
    $config = $_POST[self::FIELD] ?? null;

    if( empty($config) ){
      delete_option(self::FIELD);
    }else{
      $json = json_encode( (object) $config);
      update_option(self::FIELD, $json);
    }
    // reset it so we pull again
    $this->data = null;
  }
}

new HX_Payment_Gateway_Visibility();