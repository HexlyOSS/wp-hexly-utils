<button type="button" class="button add-order-discount-item">
  <?php esc_html_e('Add Discount', 'hx-utils'); ?>
</button>

<script type="text/template" id="tmpl-wc-modal-add-discount-item">
  <div class="wc-backbone-modal">
      <div class="wc-backbone-modal-content">
          <section class="wc-backbone-modal-main" role="main">
              <header class="wc-backbone-modal-header">
                  <h1><?php _e("Add Discount Line", 'hx-utils'); ?></h1>
                  <button class="modal-close modal-close-link dashicons dashicons-no-alt">
                      <span class="screen-reader-text">Close modal panel</span>
                  </button>
              </header>
              <article>
                  <form action="" method="post">
                      <table class="form-table">
                          <tbody>
                              <tr>
                                  <th scope="row">
                                      <label for="discount_item_description"><?php _e("Discount line description", 'hx-utils'); ?>:</label>
                                  </th>
                                  <td>
                                      <!-- <textarea name="description" id="discount_item_description" cols="60" rows="3"></textarea> -->
                                      <input id="discount_item_description" name="description" type="text" />
                                      <p class="description" id="tagline-description"><?php _e("Describe this discount", 'hx-utils'); ?>.</p>
                                  </td>
                              </tr>
                              <tr>
                                  <th scope="row">
                                      <label for="discount-item-amount"><?php _e("Amount", 'hx-utils'); ?>:</label>
                                  </th>
                                  <td>
                                      <input id="discount-item-amount" name="value" type="text" />
                                      <p class="description" id="tagline-description"><?php _e("Set the price for this discount (use non-negative decimal notation (.) )", 'hx-utils'); ?>.</p>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                  </form>
              </article>
              <footer>
                  <div class="inner">
                      <button id="btn-ok" class="button button-primary button-large"><?php _e("Add"); ?></button>
                  </div>
              </footer>
          </section>
      </div>
  </div>
  <div class="wc-backbone-modal-backdrop modal-close"></div>
</script>