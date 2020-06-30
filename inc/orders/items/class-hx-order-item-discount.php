<?php
class HX_Order_Item_Discount extends WC_Order_Item{

  protected $extra_data = [
    'amount' => 0,
  ];

  public function __construct( $o=null ) {
    parent::__construct( $o );
  }

  const TYPE = 'hx_order_item_discount';

	function get_type(){
		return self::TYPE;
	}

  public function set_amount( $amount ) {
		$this->set_prop( 'amount', wc_format_decimal( $amount ) );
	}
  public function get_amount( $context = 'view' ) {
		return $this->get_prop( 'amount', $context );
	}

}

/**
 * Class WC_Order_Item_Product_Data_Store file.
 *
 * @package WooCommerce\DataStores
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * WC Order Item Product Data Store
 *
 * @version  3.0.0
 */
class HX_Order_Item_Discount_Data_Store extends Abstract_WC_Order_Item_Type_Data_Store implements WC_Object_Data_Store_Interface, WC_Order_Item_Type_Data_Store_Interface, WC_Order_Item_Product_Data_Store_Interface {

	// /**
	//  * Data stored in meta keys.
	//  *
	//  * @since 3.0.0
	//  * @var array
	//  */
	// protected $internal_meta_keys = array( '_product_id', '_variation_id', '_qty', '_tax_class', '_line_subtotal', '_line_subtotal_tax', '_line_total', '_line_tax', '_line_tax_data' );

	// /**
	//  * Read/populate data properties specific to this order item.
	//  *
	//  * @since 3.0.0
	//  * @param WC_Order_Item_Product $item Product order item object.
	//  */
	public function read( &$item ) {
		parent::read( $item );
		$id = $item->get_id();
		$item->set_props([
      			'amount'   => get_metadata( 'order_item', $id, '_amount', true ),
            // 'description'   => get_metadata( 'order_item', $id, '_description', true ),
	// 			'product_id'   => get_metadata( 'order_item', $id, '_product_id', true ),
	// 			'variation_id' => get_metadata( 'order_item', $id, '_variation_id', true ),
	// 			'quantity'     => get_metadata( 'order_item', $id, '_qty', true ),
	// 			'tax_class'    => get_metadata( 'order_item', $id, '_tax_class', true ),
	// 			'subtotal'     => get_metadata( 'order_item', $id, '_line_subtotal', true ),
	// 			'total'        => get_metadata( 'order_item', $id, '_line_total', true ),
	// 			'taxes'        => get_metadata( 'order_item', $id, '_line_tax_data', true ),

		]);
		$item->set_object_read( true );
	}

	// /**
	//  * Saves an item's data to the database / item meta.
	//  * Ran after both create and update, so $id will be set.
	//  *
	//  * @since 3.0.0
	//  * @param WC_Order_Item_Product $item Product order item object.
	//  */
	public function save_item_data( &$item ) {
		$id                = $item->get_id();
		$changes           = $item->get_changes();
		$meta_key_to_props = array(
      '_amount' => 'amount',
      // '_description' => 'description',
			// '_product_id'        => 'product_id',
			// '_variation_id'      => 'variation_id',
			// '_qty'               => 'quantity',
			// '_tax_class'         => 'tax_class',
			// '_line_subtotal'     => 'subtotal',
			// '_line_subtotal_tax' => 'subtotal_tax',
			// '_line_total'        => 'total',
			// '_line_tax'          => 'total_tax',
			// '_line_tax_data'     => 'taxes',
		);
		$props_to_update   = $this->get_props_to_update( $item, $meta_key_to_props, 'order_item' );

		foreach ( $props_to_update as $meta_key => $prop ) {
			update_metadata( 'order_item', $id, $meta_key, $item->{"get_$prop"}( 'edit' ) );
		}
	}

	public function get_download_ids( $item, $order ) {
		return [];
	}

}

add_action( 'woocommerce_order_item_add_line_buttons', function ( $order ) {
  wp_enqueue_script( 'hx-util-item-discount-admin-scripts', HEXLY_UTIL_PLUGIN_URL . '/assets/scripts/admin-add-item-discount.js');
  wc_get_template( 'admin/orders/items/add-item-discount.php');
}, 10, 1 );

add_filter( 'woocommerce_get_order_item_classname', function($classname, $item_type, $id){
  return $item_type == 'hx_order_item_discount' ? 'HX_Order_Item_Discount' : $classname;
}, 10, 3 );

add_action( 'wp_ajax_hx_utils_discount_items_add', function() {
  check_ajax_referer( 'order-item', 'security' );

  if ( ! current_user_can( 'edit_shop_orders' ) ) {
    wp_die( -1 );
  }

  try {
    $order_id     = absint( $_POST['order_id'] );
    $order        = wc_get_order( $order_id );
    $items_to_add = wp_parse_id_list( is_array( $_POST['item_to_add'] ) ? $_POST['item_to_add'] : array( $_POST['item_to_add'] ) );
    $items        = ( ! empty( $_POST['items'] ) ) ? $_POST['items'] : '';
    $description  = ( ! empty( $_POST['description'] ) ) ? $_POST['description'] : '';
    $amount       = ( ! empty( $_POST['amount'] ) ) ? $_POST['amount'] : 0;

    if ( ! $order ) {
      throw new Exception( __( 'Invalid order', 'woocommerce' ) );
    }

    // If we passed through items it means we need to save first before adding a new one.
    if ( ! empty( $items ) ) {
      $save_items = array();
      parse_str( $items, $save_items );
      // Save order items.
      wc_save_order_items( $order->get_id(), $save_items );
    }

    $args = array('name' => $description,'amount'=> floatval($amount) * -1 );

    $item = new HX_Order_Item_Discount();
    $item->set_props( $args );
    // $item->set_backorder_meta();
    $item->set_order_id( $order->get_id() );
    $item->save();
    // do_action( 'woocommerce_ajax_added_order_items', $item_id, $item, $order );

    $data = get_post_meta( $order_id );

    ob_start();
    include( WC()->plugin_path() . '/includes/admin/meta-boxes/views/html-order-items.php' );

    wp_send_json_success( array(
      'html' => ob_get_clean(),
    ) );
  } catch ( Exception $e ) {
    wp_send_json_error( array( 'error' => $e->getMessage() ) );
  }
});

add_filter('woocommerce_order_type_to_group', function($types){
  $types['hx_order_item_discount'] = 'hx_discounts';
  return $types;
});

add_action( 'woocommerce_admin_order_items_after_fees', function($id){
  $order = wc_get_order($id);
  $items = $order->get_items('hx_order_item_discount');
  foreach ( $items as $item_id => $item ) {
    wc_get_template( 'items/html-order-discount.php', [
      'item' => $item,
      'item_id' => $item_id,
      'order' => $order,
    ] );
  }
} );


// TODO might need to do this on cart?
// woocommerce_order_after_calculate_totals
add_action( 'woocommerce_order_after_calculate_totals', function($and_taxes, $order) {
  $items = $order->get_items('hx_order_item_discount');
  $dc = 0;
  foreach($items as $item){
    $dc += $item->get_amount() ?? 0;
  }

  $discount = $order->get_discount_total();
  $total = $order->get_total();

  $order->set_discount_total( $discount );
  $order->set_total( $total + $dc );
  $order->save();
}, 10, 2);

add_action('woocommerce_admin_order_totals_after_discount', function($id){
  $order = wc_get_order($id);
  $items = $order->get_items('hx_order_item_discount');
  $dc = 0;
  foreach($items as $item){
    $dc += $item->get_amount() ?? 0;
  }
  ?>
    <tr>
      <td class="label"><?php esc_html_e( 'Discounts:', 'woocommerce' ); ?></td>
      <td width="1%"></td>
      <td class="total">
        <?php echo wc_price( $dc * -1, array( 'currency' => $order->get_currency() ) ); // WPCS: XSS ok. ?>
      </td>
    </tr>
  <?php
}, 10, 1);

// add_action( 'admin_enqueue_scripts', function(){
//   wp_enqueue_script("custom_products", plugins_url( 'custom-products.js', __FILE__ ));
// });
// add_action( 'wp_ajax_custom_products_add', 'custom_products_add' );