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
        'before_widget' => '<aside id="%1$s" class="widget %2$s">',
        'after_widget'  => '</aside>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ) );
  }

  function page_open(){
    if ( is_active_sidebar( 'hx_inside_body' ) ){
      dynamic_sidebar('hx_inside_body');
    }
  }
}

new HexlyGenericSidebars();