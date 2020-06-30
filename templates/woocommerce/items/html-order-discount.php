<?php
/**
 * Shows an order item discount
 *
 * @var object $item The item being displayed
 * @var int $item_id The id of the item being displayed
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<tr class="discount fee <?php echo ( ! empty( $class ) ) ? esc_attr( $class ) : ''; ?>" data-order_item_id="<?php echo esc_attr( $item_id ); ?>">
	<td class="thumb"><div></div></td>
	<td class="name">
		<div class="view">
			<?php echo esc_html( $item->get_name() ? $item->get_name() : __( 'Discount', 'woocommerce' ) ); ?>
		</div>
		<div class="edit" style="display: none;">
			<input type="text" placeholder="<?php esc_attr_e( 'Fee name', 'woocommerce' ); ?>" name="order_item_name[<?php echo absint( $item_id ); ?>]" value="<?php echo ( $item->get_name() ) ? esc_attr( $item->get_name() ) : ''; ?>" />
			<input type="hidden" class="order_item_id" name="order_item_id[]" value="<?php echo esc_attr( $item_id ); ?>" />
			<input type="hidden" name="order_item_tax_class[<?php echo absint( $item_id ); ?>]" value="<?php echo esc_attr( $item->get_tax_class() ); ?>" />
		</div>
		<?php do_action( 'woocommerce_after_order_discount_item_name', $item_id, $item, null ); ?>
	</td>

	<?php do_action( 'woocommerce_admin_order_item_values', null, $item, absint( $item_id ) ); ?>

	<td class="item_cost" width="1%">&nbsp;</td>
	<td class="quantity" width="1%">&nbsp;</td>

	<td class="line_cost" width="1%">
		<div class="view">
			<?php
			echo wc_price( $item->get_amount(), array( 'currency' => $order->get_currency() ) );

			// if ( $refunded = $order->get_total_refunded_for_item( $item_id, 'fee' ) ) {
			// 	echo '<small class="refunded">-' . wc_price( $refunded, array( 'currency' => $order->get_currency() ) ) . '</small>';
			// }
			?>
		</div>
		<div class="edit" style="display: none;">
			<input type="text" name="line_total[<?php echo absint( $item_id ); ?>]" placeholder="<?php echo esc_attr( wc_format_localized_price( 0 ) ); ?>" value="<?php echo esc_attr( wc_format_localized_price( $item->get_amount() ) ); ?>" class="line_total wc_input_price" />
		</div>
		<div class="refund" style="display: none;">
			<input type="text" name="refund_line_total[<?php echo absint( $item_id ); ?>]" placeholder="<?php echo esc_attr( wc_format_localized_price( 0 ) ); ?>" class="refund_line_total wc_input_price" />
		</div>
	</td>

	<td class="line_tax" width="1%"></td>

	<td class="wc-order-edit-line-item">
		<?php if ( $order->is_editable() ) : ?>
			<div class="wc-order-edit-line-item-actions">
				<!-- <a class="edit-order-item" href="#"></a> -->
				<a class="delete-order-item" href="#"></a>
			</div>
		<?php endif; ?>
	</td>
</tr>
