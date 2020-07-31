<?php

class HX_Audit_Config {

  function __construct(){
    add_filter('pre_get_comments', [$this, 'filter_query']);
  }

  function filter_query(&$query){
    global $current_screen;

    $exclude_audit_comments = apply_filters('hx_audits_exclude_audit_comment_search', true, $query);
    if( !$exclude_audit_comments ){
      return $query;
    }

    $current = $query->query_vars['type__not_in'];
    if( !is_array($current) ){
      $current = [$current];
    }
    $query->query_vars['type__not_in'] = array_merge($current, ['audit']);
    return $query;
  }
}

new HX_Audit_Config();