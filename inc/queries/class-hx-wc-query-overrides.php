<?php

class HX_WC_Query_Overrides {
  function __construct(){
    add_filter( 'woocommerce_get_wp_query_args', [$this, 'augment_args'], 10, 2 );
  }

  function augment_args($args, $vars){
    $args = $this->preserve_meta_query($args, $vars);
    return $args;
  }

  function preserve_meta_query( $args, $vars ){
    if ( isset( $vars['meta_query'] ) ) {
        $meta_query = isset( $args['meta_query'] ) ? $args['meta_query'] : [];
        $args['meta_query'] = array_merge( $meta_query, $vars['meta_query'] );
        // $q = new WP_Query($args);
        // Hexly::info($args, $q->request);
    }
    return $args;
  }
}

new HX_WC_Query_Overrides();