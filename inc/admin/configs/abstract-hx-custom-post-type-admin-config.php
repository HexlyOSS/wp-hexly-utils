<?php


// Java style names ftw
abstract class HX_Custom_Post_Type_Admin_Config {

  protected $type;
  protected $class;
  protected $box_id;
  protected $labels;
  protected $cpt;

  function __construct(){
    $this->parse_args($this->generate_config());
    $this->wire_hooks();
  }

  abstract function generate_config();
  abstract function custom_column_headers($columns);

  function parse_args($cfg){
    $this->type = $cfg['type'];
    $this->class = $cfg['class'];
    $this->box_id = $cfg['box_id'] ?? $this->type . '_details_meta_box';

    $this->labels = $cfg['labels'] ?? [];
    $this->cpt = $cfg['cpt'];
  }

  function wire_hooks(){
    add_action('init', [$this, 'init'], 5, 0 );
    add_action( 'load-edit.php', array( $this, 'on_loaded' ), 10 );
    add_action( 'admin_menu', array( &$this, 'configure_admin_fields' ) );
    add_action( 'save_post', array( &$this, 'persist_admin_fields' ), 1, 2 );
    add_filter( "manage_{$this->type}_posts_columns", [$this, 'custom_column_headers'] );
    add_action( "manage_{$this->type}_posts_custom_column" , [$this, 'custom_column'], 10, 2 );
    add_action( 'restrict_manage_posts', [$this, 'do_extra_list_filters'], 10, 2);
    add_action( 'manage_posts_extra_tablenav', [$this, 'do_after_list_filters'], 10, 1);
  }

  function is_on_loaded(){
		if ( ! isset( $_REQUEST['post_type'] ) || $this->type !== $_REQUEST['post_type'] ) {
			return;
		}
    $this->on_loaded();
  }
  function on_loaded(){}

  function init(){
    // this may need to happen earlier. probably safe on instantiation, but let's hold off it we can
    $this->data_store = WC_Data_Store::load( $this->type );
    $this->create_type($this->cpt);
  }

  function create_type($args) {
    // Set UI labels for Custom Post Type
    // $labels = array(
    //     'name' => __( 'Members' ),
    //     'singular_name' => 'Member' ,
    //     'menu_name'           => 'Members',
    //     // 'parent_item_colon'   => __( 'Parent Movie', 'hexly' ),
    //     'all_items'           => __( 'All Members', 'hexly' ),
    //     'view_item'           => __( 'Members', 'hexly' )
    //     // 'add_new_item'        => __( 'Add New Referrer', 'hexly' ),
    //     // 'add_new'             => __( 'Add New', 'hexly' ),
    //     // 'edit_item'           => __( 'Edit Movie', 'hexly' ),
    //     // 'update_item'         => __( 'Update Movie', 'hexly' ),
    //     // 'search_items'        => __( 'Search Movie', 'hexly' ),
    //     // 'not_found'           => __( 'Not Found', 'hexly' ),
    //     // 'not_found_in_trash'  => __( 'Not found in Trash', 'hexly' ),
    // );

    $default_args = array(
        'labels'              => $this->labels,
        'has_archive'         => false,
        // 'rewrite'             => array('slug' => 'hx-members'),
        // 'label'               => __( 'Members', 'hexly' ),
        // 'description'         => 'Members via Hexly',
        'supports'            => array( 'custom-fields', ),
        'taxonomies'          => array( ),
        'hierarchical'        => false, // this can get slow at even just hundreds
        'public'              => false,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'show_in_nav_menus'   => true,
        'show_in_admin_bar'   => true,
        // 'menu_position'       => 56,
        'can_export'          => false,
        'has_archive'         => false,
        'exclude_from_search' => true,
        'publicly_queryable'  => false,
        // 'capability_type'     => 'page'
    );
    $cpt = array_merge($default_args, $args);
    register_post_type($this->type, $cpt);
  }

  function get_item($id){
    return $this->data_store->get_by_post_id($id);
  }

  function custom_column($column_name, $post_id){
    global $hx_item;
    if( empty($hx_item) || $hx_item->get_id() != $post_id ){
      $hx_item = $this->get_item($post_id);
    }

    if( method_exists( $this, 'column_' . $column_name ) ){
      echo call_user_func( array( $this, 'column_' . $column_name ), $hx_item );
      // echo $this->handle_row_actions( $item, $column_name, $primary );
    }else{
      $class = get_class($this);
      echo "<!-- no $class#column_$column_name defined -->";
    }
  }

  function configure_admin_fields() {
    if ( function_exists( 'add_meta_box' ) ) {
      add_meta_box( $this->box_id, 'Details', array( &$this, 'render_admin_fields' ), $this->type, 'normal', 'high' );
    }
  }

  function render_admin_fields(){
    global $post;
    $item = new $this->class($post->ID);
    $nonce = $this->box_id . '_nonce';
    $nonce = wp_nonce_field( $this->box_id, $nonce, false, false );

    wc_get_template( 'admin/generic/form-inputs.php', [
      'type' => $this->type,
      'item' => $item,
      'nonce' => $nonce,
      'hook_prefix' => $this->get_admin_form_hook_prefix(),
    ] );
  }

  function persist_admin_fields( $post_id, $post ) {
    $nonce = $this->box_id . '_nonce';
    $nonce = $_POST[$nonce] ?? null;
    if ( empty($nonce) || !wp_verify_nonce( $nonce, $this->box_id ) )
      return;
    if ( !current_user_can( 'edit_post', $post_id ) )
      return;
    // if ( ! in_array( $post->post_type, $this->postTypes ) )
    //   return;
    if( $post->post_type !== $this->type ){
      return;
    }

    try {
      $item = $this->get_item($post_id);
      $this->do_persist_admin_fields($item, $post_id, $post);
      $item->save();
    } catch(Error $err){
      Hexly::warn('Failed to persist admin fields on post_id=[' . $post_id . '] reason=[' . $err->getMessage() . ']');
    }
  }


  function extra_list_filters($loc){}
  function do_extra_list_filters($post_type, $loc){
    if( $post_type !== $this->type ){
      return;
    }
    $this->extra_list_filters($loc);
  }

  function after_list_filters($loc){}
  function do_after_list_filters($loc){
    if( ($_GET['post_type'] ?? null) !== $this->type ){
      return;
    }
    $this->after_list_filters($loc);
  }


  function do_persist_admin_fields( $item, $post_id, $post ) {
    $values = [];
    $adjustments = [];

    foreach ( $item->get_fields() as $id => $field ) {
      // TODO lock down capabilities
      // if ( current_user_can( $customField['capability'], $post_id ) ) {
        $type = $field['type'];
        $post_key = $id;

        $value = $_POST[$post_key];
        if ( $customField['type'] == "wysiwyg" ) $value = wpautop( $value );

        if (in_array($type, ['int', 'float'])) {
          if( empty($value) && !is_numeric($value) ){
            $value = null;
          }else if (!is_numeric($value)) {
            throw new Exception("Non-numeric value for $id ($type) cannot be accepted; Check the value `$value`");
          }
        }
        $item->{"set_$id"}($value);
    }
  }

  function get_admin_form_hook_prefix(){
    return "hx_admin_config_generic_form_input_{$this->type}_";
  }
}