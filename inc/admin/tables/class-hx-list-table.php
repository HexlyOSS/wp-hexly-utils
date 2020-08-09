<?php

abstract class HX_List_Table extends WP_List_Table {


	protected $max_items;
	protected $columns;

	public function __construct($args, $columns) {
		parent::__construct($args);
		$this->columns = $columns;
	}

	public function get_columns() {
		return $this->columns;
	}

	public function no_items() {
		$label = $this->_args['plural'] ?? 'records';
		_e( "No $label found.", 'hx_util' );
	}

	// public function column_default( $item, $column_name ) {
	// 	if( method_exists( $this, $column_name ) ){
	// 		call_user_func([$this, $column_name ], $item);
	// 	}else {
	// 		echo "No column found: <strong>$column_name</strong>";
	// 	}
	// }

	public function prepare_items() {
		$this->_column_headers = array( $this->get_columns(), array(), $this->get_sortable_columns() );
		$current_page          = absint( $this->get_pagenum() );
		$per_page              = apply_filters( 'hx_smartship_table_per_page_' . get_class($this), 50 );

		$order_col = $_GET['orderby'] ?? null;
		$order_dir = $_GET['order'] ?? 'asc';

    [$this->items, $this->max_items] = $this->get_data($current_page, $per_page, $order_dir, $order_col);

		$this->set_pagination_args([
			'total_items' => $this->max_items,
			'per_page'    => $per_page,
			'total_pages' => ceil( $this->max_items / $per_page ),
		]);
	}

	public function display() {

		$this->handle_table_actions();

		$this->before_form();
		$this->form_open();
		parent::display();
		$this->form_close();
		$this->after_form();
	}

	protected function handle_table_actions(){
		if ( !array_key_exists('action', $_GET) ){
			return;
		}

		$action = $_GET['action'];
		if( method_exists( $this, 'action_' . $action ) ){
			call_user_func([$this, 'action_' . $action ]);
		}else {
			Hexly::info('HX_List_Table [type=' . get_class($this) . '] has no method [missing=action_' . $action . ']');
		}
	}
	protected function before_form(){ }
	protected function after_form(){ }

	protected function form_open(){
		do_action('hx_util_list_table_before_form', $this);
		echo '<form class="hx-list-table class-' . get_class($this) . '" method="get">';
		echo '<input type="hidden" name="page" value="' . $_REQUEST['page'] . '" />';
		do_action('hx_util_list_table_before_inside_form', $this);
	}

	protected function form_close(){
		do_action('hx_util_list_table_after_inside_form', $this);
		echo '</form>';
		do_action('hx_util_list_table_after_form', $this);
	}

  protected abstract function get_data($current_page, $per_page, $order_by, $order_col);

	public function column_cb( $row ) {

		$id = $this->get_cb_value($row);
		if( !empty($id) ){
			$name = $this->get_cb_parameter($row);
			return '<input name="' . $name . '" type="checkbox" value="' . esc_attr( $id ) .'" />';
		}
	}

	/**
	 * Pulls the value for a given Checkbox-per-row
	 */
	public function get_cb_value($row){
		$prop = $this->get_cb_prop($row);
		$value = null;
		if( is_array($row) && array_key_exists($prop, $row) ){
			$value = $row[$prop];
		}else if( is_object($row) && method_exists( $row, 'get_' . $prop ) ){
			$method = "get_$prop";
			$value = $row->$method();
		}else if ( is_object($row) && property_exists( $row, $prop) ){
			$value = $row->$prop;
		}

		return $value;
	}

	/**
	 * What property do we look for on each row for the "checkbox value"
	 */
	public function get_cb_prop($row){
		return 'id';
	}

	/**
	 * What do we name the parameter in the $_GET results
	 */
	public function get_cb_parameter($row){
		return 'ids[]';
	}

}