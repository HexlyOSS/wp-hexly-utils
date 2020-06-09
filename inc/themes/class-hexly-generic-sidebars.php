<?php



class HexlyGenericSidebars {


  function __construct(){
    $sidebar1 = array(
      'before_widget' => '<div class="widget %2$s">',
      'after_widget' => '</div>',
      'before_title' => '<h2 class="widgettitle">',
      'after_title' => '</h2>',
      'name'=>__( 'My sidebar 1', 'textdomain' ),
    );
  }
}

new HexlyGenericSidebars();