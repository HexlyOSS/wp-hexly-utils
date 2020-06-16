<?php



class HexlyGenericSidebars {

  function __construct(){
    add_action( 'widgets_init', [$this, 'register_sidebars'], 1, 0 );
    add_action('wp_body_open', [$this, 'page_open']);
  }

  function register_sidebars(){
    register_sidebar( array(
        'name'          => __( 'Hexly Inside Body', 'theme_name' ),
        'id'            => 'hx_inside_body',
        'before_widget' => '',
        'after_widget'  => '',
        'before_title'  => '',
        'after_title'   => '',
    ) );
  }

  function page_open(){
    if ( is_active_sidebar( 'hx_inside_body' ) ){
      dynamic_sidebar('hx_inside_body');
    }
  }
}

new HexlyGenericSidebars();