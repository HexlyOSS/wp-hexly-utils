<?php


class HX_Gift_Item_Coupon {

  const META_KEY = '_hx_coupons_gift_item';
  const FIELD = 'gift_item_ids';

  const CART_ITEM_META_COUPON = '_hx_coupons_gift_item';

  const ORDER_META_COUPON_SETTINGS = '_hx_coupons_gift_item';
  const ORDER_ITEM_META_COUPON = '_hx_coupons_gift_item_coupon';
  const VARIABLE_PRODUCT_TYPE = 'variable';

  public function __construct() {
    add_filter('woocommerce_hidden_order_itemmeta', [$this, 'filter_order_item_meta'], 10, 1);
    add_action( 'woocommerce_coupon_options', [ $this, 'render_options' ], 10, 2 );
    add_action( 'woocommerce_coupon_options_save', [ $this, 'save_options' ], 10, 2 );

    add_filter( 'woocommerce_coupon_is_valid_for_cart', [ $this, 'is_valid'], 10, 2 );
    add_filter( 'woocommerce_cart_totals_coupon_label', [$this, 'filter_cart_html'], 10, 2);

    add_filter('woocommerce_get_item_data', [$this, 'build_item_data'], 10, 2);
    add_action('woocommerce_before_order_itemmeta', [$this, 'maybe_show_adjustment_notice'], 10, 3);

    add_action('woocommerce_checkout_create_order_line_item', [$this, 'copy_metadata_to_order_item'], 10, 4);

    // allow coupons when cart is empty (so you can add gifts, mofos)
    add_action('woocommerce_cart_is_empty', [$this, 'coupon_empty_cart'], 10, 0);

    add_action('woocommerce_applied_coupon', [$this, 'woocommerce_applied_coupon'], 10, 1 );
    add_action('woocommerce_removed_coupon', [$this, 'woocommerce_removed_coupon'], 10, 1 );

    add_filter('woocommerce_cart_item_remove_link', [$this, 'hide_remove_cart_link'], 10, 2);
    // add_filter('woocommerce_cart_item_price', $this->hide_amount('Free Gift!'), 10, 2);
    // add_filter('woocommerce_cart_item_subtotal', $this->hide_amount(''), 10, 2);
    add_filter('woocommerce_cart_item_quantity', [$this, 'hide_qty'], 10, 3);


    // maybe woocommerce_coupon_is_valid at macro level?
    add_filter('woocommerce_coupon_get_discount_amount', [$this, 'filter_amount'], 10, 5);
    
    // Make sure our gift coupons dont apply to NON-GIFT items
    add_filter('hx_coupon_applied_to_product', [$this, 'apply_coupon'], 10, 3);

    // Coupon Variations
    // add_action('woocommerce_applied_coupon', [$this, 'action_woocommerce_applied_coupon']);
    add_action('wp_ajax_choose_gift_item', [$this, 'action_choose_gift_item']);
    // add_action('woocommerce_after_cart_table', [$this, 'action_woocommerce_after_cart_table']);
    add_filter('woocommerce_get_item_data', [$this, 'coupon_woocommerce_get_item_data'], 11, 2);
    add_action('wp_enqueue_scripts', [$this, 'action_wp_enqueue_scripts']);
  }

  function action_wp_enqueue_scripts() {
    wp_register_script( 'gift-item-meta', HEXLY_UTIL_PLUGIN_URL . '/assets/scripts/gift-item-meta.js', null, null, true );
  }

  function coupon_woocommerce_get_item_data($results, $ci_data) {
    // WC()->cart->empty_cart();
    $code = $ci_data[self::CART_ITEM_META_COUPON] ?? null;
    if( empty($code) ) {
      return $results;
    }

    wp_enqueue_script( 'gift-item-meta');
    wp_add_inline_script( 'gift-item-meta', 'var params = ' . json_encode([
        'ajaxUrl' => admin_url( 'admin-ajax.php' ),
        'giftItemCode' => $code,
    ]), 'before');

    // $data = $ci_data['data'];
    // $data_keys = array_keys($data->get_data());
    // error_log(print_r(['$data_keys' => $data_keys], true));
    $children_names = $this->get_variant_names($code);
    wc_get_template('gift-item-meta.php', [
      'children_names' => $children_names,
      'coupon_code'    => $code
    ]);
    return $results;
  }

  // function action_woocommerce_after_cart_table() {
  //   $this->render_modal($children_names, $coupon_code);
  //   echo '<h1>fdafdafd</h1>';
  // }

  function action_choose_gift_item() {
    $item_chosen = $_POST['item_chosen'];
    $gift_item_code = $_POST['gift_item_code'];

    $cart =  WC()->cart;
    $cart_contents = $cart->get_cart_contents();
    $item_to_remove_key;
    foreach ($cart_contents as $key => $value) {
      if ($value['_hx_coupons_gift_item'] == $gift_item_code) {
        $item_to_remove_key = $key;
      }
      $val_keys = array_keys($value);
      // error_log(print_r(['$key' => $key], true));
      // error_log(print_r(['$value[\'key\']' => $value['key']], true));
      // error_log(print_r(['$val_keys' => $val_keys], true));
    }

    if (!$item_to_remove_key) {
      Hexly::panic("Key for hexly gift item using code #$gift_item_code not found!");
      wp_die(200);
      return false;
    }
    
    // error_log(print_r(['$item_to_remove_key' => $item_to_remove_key], true));
    // $item_to_remove_key = $cart->find_product_in_cart($item_to_remove);
    $res = $cart->remove_cart_item($item_to_remove_key);
    $res = $cart->add_to_cart($item_chosen, 1, null, null, [self::CART_ITEM_META_COUPON => $gift_item_code]);
    wp_die(json_encode($cart));
  }

  function get_variant_names($coupon_code) {
    $coupon = new WC_Coupon($coupon_code);
    $gift_item_id = $coupon->get_meta(self::META_KEY, true);
    $coupon_metadata = $coupon->get_meta_data();

    if (empty($gift_item_id)) {
      Hexly::warn('No ' . self::META_KEY . ' found!');
      return;
    }

    $product = wc_get_product($gift_item_id);
    $product_type = $product->get_type();

    if ($product_type != self::VARIABLE_PRODUCT_TYPE) {
      return;
    }

    $product_children = $product->get_children();
    if (empty($product_children)) {
      Hexly::warn("No children found for product #$gift_item_id!");
      return;
    }

    $children_names;
    foreach ($product_children as $pc) {
      $pc_object = wc_get_product($pc);
      $children_names[] = ['name' => $pc_object->get_name(), 'id' => $pc_object->get_id()];
    }

    return $children_names;
  }

  function render_modal($children_names, $coupon_code) {
    ?>
      <script>
        var giftItemCode = <?php echo json_encode($coupon_code); ?>;
        var childrenNames = <?php echo json_encode($children_names); ?>;
        var ajaxUrl = <?php echo json_encode(admin_url('admin-ajax.php')); ?>;
        var overlay = jQuery('<div id="modal-overlay"></div>');
        var modal = jQuery('<div id="modal"></div>');
        var modalHeader = jQuery('<div id="modal-header">Please Select One</div>');
        var modalForm = jQuery('<form id="modal-form"></form>');
        console.log({ variationField });
        var contentHTML = childrenNames.map(el => {
          return `<p><input id="form-input-${el.id}" type="radio" name="size" value="${el.id}"></input><label for="form-input-${el.id}">${el.name}</label></p>`;
        }).join('');
        var formContent = jQuery(`<div id="form-content">${contentHTML}</div>`);
        var formSubmit = jQuery(`<button id="form-submit">Submit</button>`);
        jQuery(document).ready(function() {
          variationField.append("<h1>stuff!</h1>");
          // jQuery('body').append(overlay);
          // jQuery('#modal-overlay').append(modal);
          // jQuery('#modal').append(modalHeader);
          // jQuery('#modal').append(modalForm);
          // jQuery('#modal-form').append(formContent);
          // jQuery('#modal-form').append(formSubmit);
  
          jQuery('#modal-form').submit(function(e) {
            e.preventDefault();
            const checkedField = jQuery('#modal-form input:checked').first().val();
            
            if (checkedField === undefined) {
              return;
            }

            const data = {
              'action': 'choose_gift_item',
              'gift_item_code': giftItemCode,
              'item_chosen': checkedField
            };

            jQuery.post(ajaxUrl, data, function (res) {
              console.log({ res });
            })
            console.log({ checkedField });
          });
        }); 
      </script>
      <style>
        #modal-overlay {
          display: flex;
          justify-content: center;
          align-items: center;
          position: fixed; 
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,.5);
          z-index: 20000;
        }

        #modal {
          background: white;
          opacity: 1;
          border-radius: 14px;
          width: 400px;
          height: 300px;
        }

        #modal-header {
          color: white;
          background: darkgray;
        }

        #form-content {

        }

      </style>
    <?php
  }

  function apply_coupon($applies, $li, $coupon){
    $is_gift_coupon = $coupon->get_meta(self::META_KEY, true);
    if(!empty($is_gift_coupon)){
      $gift_item_coupon = $li->get_meta(self::ORDER_ITEM_META_COUPON, true);
      if($coupon->get_code() !== $gift_item_coupon){
        return false;
      }
    }
    return $applies;
  }

  function copy_metadata_to_order_item($oi, $cid, $ci, $order ){
    $added_by = $ci[self::CART_ITEM_META_COUPON] ?? null;
    if( !empty($added_by) ){
      $oi->update_meta_data(self::ORDER_ITEM_META_COUPON, $added_by);
    }
  }


  function hide_remove_cart_link($html, $cid){
    $cart = WC()->cart;
    if( empty($cart) ){
      return $html;
    }
    $item = $cart->get_cart_item($cid) ?? [];
    $added_by = $item[self::CART_ITEM_META_COUPON] ?? null;
    if( !empty($added_by) ){
      $html = ''; // '<a href="javascript:window.alert(\'This gift was added by a coupon. To remove it, please remove the coupon: ' . $added_by . '\')">&times</a>';
    }
    return $html;
  }


  function hide_amount($text){
    return function($html, $item) use ( $text) {
      $added_by = $item[self::CART_ITEM_META_COUPON] ?? null;
      if( !empty($added_by) ){
        $html = $text;
      }
      return $html;
    };
  }

  function hide_qty($html, $cid, $item){
    $added_by = $item[self::CART_ITEM_META_COUPON] ?? null;
    if( !empty($added_by) ){
      $html = '1'; // '<a href="javascript:window.alert(\'This gift was added by a coupon. To remove it, please remove the coupon: ' . $added_by . '\')">&times</a>';
    }
    return $html;
  }

  function filter_amount($amount, $dc_amount, $item, $single, $coupon){
    $code = $coupon->get_code();
    $full_amount = $amount + $dc_amount;

    $added_by = $item[self::CART_ITEM_META_COUPON] ?? null;

    $meta = $coupon->get_meta(self::META_KEY, true);
    $meta = empty($meta) ? [] : explode(',', $meta);


    // if the item isn't a gift, but this is a gift coupon, remove the discount
    if( empty($added_by) && !empty($meta) ){
      return 0;
    }

    // if the item is a gift, but it's not for the code in question, remove the discount
    if( !empty($added_by) && $added_by !== $code ){
      return 0;
    }

    // otherwise, they get their discount!
    return $amount;
  }



  function woocommerce_applied_coupon($code){
    $coupon = new WC_Coupon($code);
    if( empty($coupon) ){
      return;
    }

    $cart = WC()->cart;
    if( empty($cart) ){
      HX::warn('Cart should not be null, but it is. Bailing on coupon check');
      return;
    }

    $matches = $this->get_matches($cart, $coupon);
    foreach( ($matches->missing ?? []) as $m){
      [$cid, $pid, $vid, $ci_data] = $m;
      $added = $cart->add_to_cart($pid, 1, $vid, [], $ci_data);
    }
  }

  function woocommerce_removed_coupon($code){
    $coupon = new WC_Coupon($code);
    if( empty($coupon) ){
      return;
    }

    $cart = WC()->cart;
    if( empty($cart) ){
      HX::warn('Cart should not be null, but it is. Bailing on coupon check');
      return;
    }

    $matches = $this->get_matches($cart, $coupon);
    // Hexly::info ('$matches', $matches);
    foreach( ($matches->existing ?? []) as $m){
      [$cid, $pid, $vid, $ci_data] = $m;
      $added = $cart->remove_cart_item($cid);
    }
  }



  function coupon_empty_cart(){

    ?>
    <form class="woocommerce-cart-form" action="<?php echo esc_url( wc_get_cart_url() ); ?>" method="post">
      <div class="coupon" style="margin-bottom: 15px">
        <label for="coupon_code"><?php esc_html_e( 'Coupon:', 'woocommerce' ); ?></label>
        <input type="text" name="coupon_code" class="input-text" id="coupon_code" value="" placeholder="<?php esc_attr_e( 'Coupon code', 'woocommerce' ); ?>" />
        <button type="submit" class="button" name="apply_coupon" value="<?php esc_attr_e( 'Apply coupon', 'woocommerce' ); ?>">
          <?php esc_attr_e( 'Apply coupon', 'woocommerce' ); ?>
        </button>
      </div>
      <?php do_action( 'woocommerce_cart_coupon' ); ?>
    </form>
    <?php
  }

  function filter_order_item_meta($keys){
    if( !in_array(self::ORDER_ITEM_META_COUPON, $keys)){
      $keys[] = self::ORDER_ITEM_META_COUPON;
    }
    return $keys;
  }

  public function render_options($coupon_get_id, $coupon) {
    ?>
    <p class="form-field">
      <label><?php _e( 'Gift Products', 'woocommerce' ); ?></label>
      <select class="wc-product-search" multiple="multiple" style="width: 50%;" name="<?php echo self::FIELD ?>[]" data-placeholder="<?php esc_attr_e( 'Search for a product&hellip;', 'woocommerce' ); ?>" data-action="woocommerce_json_search_products_and_variations">
        <?php
        // $product_ids = $coupon->get_product_ids( 'edit' );
        $existing = $coupon->get_meta(self::META_KEY, true);
        $product_ids = empty($existing) ? [] : explode(',', $existing);

        foreach ( $product_ids as $product_id ) {
          $product = wc_get_product( $product_id );
          if ( is_object( $product ) ) {
            echo '<option value="' . esc_attr( $product_id ) . '"' . selected( true, true, false ) . '>' . htmlspecialchars( wp_kses_post( $product->get_formatted_name() ) ) . '</option>';
          }
        }
        ?>
      </select>
      <?php echo wc_help_tip( __( 'Products that the coupon will be applied to, or that need to be in the cart in order for the "Fixed cart discount" to be applied.', 'woocommerce' ) ); ?>
    </p>
    <?php
  }

  function save_options( $post_id, $coupon ) {
    $roles = $_POST[self::FIELD] ?? null;
    if ( !empty($roles) ) {
      $coupon->update_meta_data(self::META_KEY, implode(',', $roles));
    }else{
      $coupon->delete_meta_data(self::META_KEY);
    }
    $coupon->save_meta_data();

  }

  function is_valid($result, $coupon){
    $existing = $coupon->get_meta(self::META_KEY, true);
    $existing = empty($existing) ? [] : explode(',', $existing);
    if( !empty($existing) ){
      // Hexly::info('is it valid?', $existing);

    }
    return $result;
  }

  // TODO display a message here one day?
  function filter_cart_html($coupon_html, $coupon){
    if (!$this->is_valid(true, $coupon)) {
      // $coupon_html .= '<br>(ineligible)';
    }
    return $coupon_html;
  }

  function build_item_data($results, $ci_data){
    $code = $ci_data[self::CART_ITEM_META_COUPON] ?? null;
    if( !empty($code) ){
      $results[] = [
        'key' => 'Gift Item',
        'value' => "<strong>$code</strong>",
      ];
    }
    return $results;
  }

  function maybe_show_adjustment_notice($item_id, $item, $product){
    $added_by = $item->get_meta(self::ORDER_ITEM_META_COUPON, true);
    if( empty($added_by) ){
      return;
    }
    $html = "<p>Gift Coupon <strong>$added_by</strong>.</p>";
    echo $html;
  }



  /**
   * Returns null if not applicable, or { existing: [...], missing: [...] }
   */
  private function get_matches($cart, $coupon){
    $code = $coupon->get_code();

    $meta = $coupon->get_meta(self::META_KEY, true);
    $meta = empty($meta) ? [] : explode(',', $meta);
    if( empty($meta) ){
      return null;
    }

    $existing = [];
    $missing = [];

    $ci_data = [self::CART_ITEM_META_COUPON => $code];

    foreach ($meta as $id) {
      $product = wc_get_product($id);
      $p_class = get_class($product);
      $p_type = $product->get_type();
      Hexly::info ('$p_class', $p_class);
      Hexly::info ('$p_type', $p_type);
      if( !$product ){
        Hexly::warn('Could not find coupon item to apply for id=' . $id);
        continue;
      }

      if( $product instanceof WC_Product_Variation ){
        $vid = $product->get_id();
        $pid = $product->get_parent_id();
      } else if ($product instanceof WC_Product_Variable) {
        Hexly::info ('Is instance of WC_Product_Variable!');
        $pid = $product->get_id();
        $vid = $product->get_id();
      } else{
        $vid = 0;
        $pid = $product->get_id();
      }

      /* DANGER: THIS DOESNT WORK WITH VARIATIONS; the CID is not matching after defaults */
      // $cid = $cart->generate_cart_id($pid, $vid, [], $ci_data);
      // $found = $cart->find_product_in_cart($cid);

      $found = false;
      foreach ($cart->get_cart() as $cid => $item) {
        // Hexly::info('item', $cid, array_keys($item));

        $t_pid = $item['product_id'] ?? null;
        $t_vid = $item['variation_id'] ?? null;
        $added_by = $item[self::CART_ITEM_META_COUPON] ?? null;



        $targeted = !empty($added_by) && $added_by === $code;
        $pid_match = $t_pid === $pid;
        $vid_match = (empty($t_vid) && empty($vid)) || (intval($t_vid) === intval($vid));


        $already_added = $targeted && $pid_match && $vid_match;
        Hexly::info(
          'checking',
          [$pid, $vid, $t_pid, $t_vid],
          [$targeted, $pid_match, $vid_match]
        );

        if( $already_added ){
          $found = true;
          break;
        }
      }

      if( $found ){
        // Hexly::info(['yes', $cid, $pid, $vid]);
        $existing[] = [$cid, $pid, $vid, $ci_data];
      }else{
        // Hexly::info(['no', $cid, $pid, $vid]);
        $missing[] = [null, $pid, $vid, $ci_data];
      }
    }

    return (object)[
      // TODO should we search for others that aren't in the config now?!
      'missing' => $missing,
      'existing' => $existing
    ];
  }

}

new HX_Gift_Item_Coupon();