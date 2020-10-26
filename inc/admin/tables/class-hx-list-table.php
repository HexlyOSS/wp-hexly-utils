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
		$this->before_row($item);
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
		$this->after_row($item);
	}

	public function prepare_items() {
		$this->_column_headers = array( $this->get_columns(), array(), $this->get_sortable_columns() );
		$current_page          = absint( $this->get_pagenum() );

		$per_page = $_GET['per_page'] ?? null;
		$per_page = is_numeric($per_page) ? intval($per_page) : apply_filters( 'hx_list_table_per_page_' . get_class($this), 50 );

		$order_col = $_REQUEST['orderby'] ?? null;
		$order_dir = $_REQUEST['order'] ?? 'asc';

    [$this->items, $this->max_items] = $this->get_data($current_page, $per_page, $order_dir, $order_col);

		$this->set_pagination_args([
			'total_items' => $this->max_items,
			'per_page'    => $per_page,
			'total_pages' => ceil( $this->max_items / $per_page ),
		]);
	}

	protected function bulk_actions( $which = '' ) {
		parent::bulk_actions($which);
	}

	public function display() {
		$this->before_form();
		$this->form_open();
		parent::display();
		$this->form_close();
		$this->after_form();
	}

	public function handle_table_actions(){
		// Hexly::info('handle actions', $_REQUEST);
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
		// Hexly::info('handle actions', $ids);
		if( method_exists( $this, 'action_' . $action ) ){
			call_user_func([$this, 'action_' . $action ], $ids);
		}else {
			Hexly::info('HX_List_Table [type=' . get_class($this) . '] has no method [missing=action_' . $action . ']');
		}
	}

	protected function before_form(){
		$params = $_GET;
		$path = $_SERVER['SCRIPT_NAME'] . '?';

		echo '<form method="GET" action="'. $path . '">';
		foreach($_GET as $key => $value ){
			echo '<input type="hidden" name="' . $key . '" value="' . $value .'">';
		}

		echo '<div class="tablenav top">';

		$this->show_search();
		$this->show_filters();
		echo '</div>';
		echo '</form><!--findme-->';
	}

  function show_search(){
    // $url = admin_url( 'admin-ajax.php' ) . '?action=hx_loyalty_file_form&redirect=' . urlencode($_SERVER['REQUEST_URI']);
		$search = $_REQUEST['s'] ?? '';
    ?>
    <p class="search-box">
      <label class="screen-reader-text" for="post-search-input">Search:</label>
      <input type="search" id="post-search-input" name="s" value="<?php echo $search ?>">
      <input type="submit" id="search-submit" class="button" value="Search"></p>
    </p>
    <?php
  }

	function get_filters(){
		return [
			['type' => 'per_page']
		];
	}

	function show_filters(){
		$filters = $this->get_filters();
		if (empty($filters)) {
				return;
		}
		echo '<div class="alignleft actions">';

		foreach($filters as $f){
			// echo '<input type="text" name="foofilter"></input>';
			switch ($f['type']) {
				case 'customer':
						$this->render_customer_picker($f);
						break;

					case 'date_range':
						$this->render_date_range_picker($f);
						break;

					case 'per_page':
						$this->render_per_page($f);
						break;

				default:
						echo "Error: not sure how to handle " . $f['type'];
						break;
			}
		}
		submit_button( __( 'Filter' ), '', 'filter_request', false, array( 'id' => 'post-query-submit' ) );
		echo '</div><div style="clear: both"></div>';
	}

	function render_date_range_picker($f) {
		$start = $_GET['_filter_date_range_start'] ?? '';
		$end = $_GET['_filter_date_range_end'] ?? '';
		?>
		<input type="text"
			class="date-picker"
			name="_filter_date_range_start"
			maxlength="10"
			value="<?php echo empty($start) ? '' : esc_attr( date_i18n( 'Y-m-d', strtotime( $start ) ) ); ?>"
			pattern="<?php echo esc_attr( apply_filters( 'woocommerce_date_input_html_pattern', '[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|1[0-9]|2[0-9]|3[01])' ) ); ?>" />
		<input type="text"
			class="date-picker"
			name="_filter_date_range_end"
			maxlength="10"
			value="<?php echo empty($end) ? '' : esc_attr( date_i18n( 'Y-m-d', strtotime( $end ) ) ); ?>"
			pattern="<?php echo esc_attr( apply_filters( 'woocommerce_date_input_html_pattern', '[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|1[0-9]|2[0-9]|3[01])' ) ); ?>" />
		<?php
	}

	function render_per_page($f){
		$per_page = $_GET['per_page'] ?? null;
		$per_page = is_numeric($per_page) ? intval($per_page) : apply_filters( 'hx_list_table_per_page_' . get_class($this), 50 );
		?>
		<label class="page-size-picker">
			<select
				id="per_page"
				name="per_page"
				class='hx-select2'
				data-placeholder="Page Size"
				data-allow_clear="true">
				<option value="<?php echo $per_page ?>" selected="selected"><?php echo $per_page ?><option>
				<?php foreach([5,10,25,50,100,250,500,1000] as $max_size): ?>
					<?php if($max_size !== $per_page): ?>
						<option value="<?php echo $max_size ?>"><?php echo $max_size ?><option>
					<?php endif; ?>
				<?php endforeach; ?>

			</select>
		</label>
		<?php
	}

	function render_customer_picker($f) {
		$user_string = '';
		$user_id     = '';

		if ( ! empty( $_GET['_customer_user'] ) ) { // phpcs:disable WordPress.Security.NonceVerification.Recommended
			$user_id = absint( $_GET['_customer_user'] ); // WPCS: input var ok, sanitization ok.
			$user    = get_user_by( 'id', $user_id );

			$user_string = sprintf(
				/* translators: 1: user display name 2: user ID 3: user email */
				esc_html__( '%1$s (#%2$s &ndash; %3$s)', 'woocommerce' ),
				$user->display_name,
				absint( $user->ID ),
				$user->user_email
			);
		}
		?>
		<select
			class="wc-customer-search"
			id="customer_user"
			name="_customer_user"
			data-placeholder="<?php esc_attr_e( 'Customer', 'woocommerce' ); ?>"
			data-allow_clear="true">
			<option value="<?php echo esc_attr( $user_id ); ?>" selected="selected"><?php echo htmlspecialchars( wp_kses_post( $user_string ) ); // htmlspecialchars to prevent XSS when rendered by selectWoo. ?><option>
		</select>
		<?php
	}

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

	function before_row($item){
		do_action('hx_util_list_table_before_row', $item, $this);
	}

	function after_row($item){
		do_action('hx_util_list_table_before_after', $item, $this);
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