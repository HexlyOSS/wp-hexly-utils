<?php

if(!class_exists('WP_List_Table')){
	require_once( ABSPATH . 'wp-admin/includes/screen.php' );
	require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}

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

	public function single_row( $item ) {
		try {
			ob_start();
			[$columns] = $this->get_column_info();
			parent::single_row($item);
		}catch(Error $err){
			ob_end_clean();
			$span = count($columns);
			echo "<tr><td colspan=\"$span\"> Received an error processing this row. Please see the logs </td></tr>";
			Hexly::info('Failed to process row due to Error: ' . $err->getMessage(), $item);
		}
	}

	public function prepare_items() {
		$this->_column_headers = array( $this->get_columns(), array(), $this->get_sortable_columns() );
		$current_page          = absint( $this->get_pagenum() );
		$per_page              = apply_filters( 'hx_list_table_per_page_' . get_class($this), 5 );

		$order_col = $_REQUEST['orderby'] ?? null;
		$order_dir = $_REQUEST['order'] ?? 'asc';

    [$this->items, $this->max_items] = $this->get_data($current_page, $per_page, $order_dir, $order_col);

		$this->set_pagination_args([
			'total_items' => $this->max_items,
			'per_page'    => $per_page,
			'total_pages' => ceil( $this->max_items / $per_page ),
		]);
	}

	public function display() {
		$this->before_form();
		$this->form_open();
		parent::display();
		$this->form_close();
		$this->after_form();

	}

	public function handle_table_actions(){
		if ( !array_key_exists('action', $_REQUEST) ){
			return;
		}

		$param = $this->get_cb_parameter(null);
		if ( !array_key_exists($param, $_REQUEST) ){
			return;
		}

		// get our IDs, and ensure they're in an array
		$ids = $_REQUEST[$param];
		$ids = is_array($ids) ? $ids : [$ids];

		$action = $_REQUEST['action'];
		if( method_exists( $this, 'action_' . $action ) ){
			call_user_func([$this, 'action_' . $action ], $ids);
		}else {
			Hexly::info('HX_List_Table [type=' . get_class($this) . '] has no method [missing=action_' . $action . ']');
		}
	}
	protected function before_form(){ }
	protected function after_form(){ }

	protected function form_open(){
		do_action('hx_util_list_table_before_form', $this);
		echo '<form class="hx-list-table class-' . get_class($this) . '" method="post">';
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
		if( $row === null || !empty($id) ){
			$name = $this->get_cb_parameter($row, 'html-input');
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
	 * What do we name the parameter in the $_REQUEST results
	 * @param $row - mixed; nullable; the row of the table, or null if not in context of the table
	 * @param $format - string; nullable; the context being used in (html-input for the element's ID tag)
	 */
	public function get_cb_parameter($row, $format=null){
		return 'ids' . ($format=='html-input' ? '[]' : '' );
	}

}