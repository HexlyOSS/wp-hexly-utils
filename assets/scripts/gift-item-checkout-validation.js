// jQuery(document.body).ready(disableSubmitBtn);
jQuery(document.body).on('country_to_state_changed', couponAjax);
jQuery(document.body).on('country_to_state_changed', disableSubmitBtn);

function couponAjax () {
  if (typeof params === 'undefined') {
    return;
  }
  var selectElement = jQuery('#gift-variants-select');

  if (!selectElement.length) {
    return;
  }
  var { ajaxUrl, giftItemCode } = params;
  selectElement.change(function (e) {
    e.preventDefault();

    const selectedOption = jQuery('#gift-variants-select option:selected').val();

    if (selectedOption === undefined || selectedOption == 0) {
      return;
    }

    const data = {
      'action': 'choose_gift_item',
      'gift_item_code': giftItemCode,
      'item_chosen': selectedOption
    };

    jQuery.post(ajaxUrl, data, function (res) {
      location.reload();
    })
  })
}

function disableSubmitBtn () {
  if (typeof giftParams === 'undefined') {
    return;
  }
  var { disabled } = giftParams
  var placeOrderBtn = jQuery('#place_order');
  var selectElement = jQuery('#gift-variants-select');
  var placeOrderRow = jQuery('.form-row.place-order');
  var placeOrderWarningText = jQuery('<div>Please Complete Checkout Form!</div>');

  placeOrderBtn.prop("disabled", disabled);
  placeOrderBtn.css('background-color', 'lightgray');
  placeOrderBtn.css('cursor', 'default');

  selectElement.css('border', 'red 3px dotted');

  placeOrderRow.append(placeOrderWarningText);
  placeOrderWarningText.css('text-align', 'center');
  placeOrderWarningText.css('color', 'red');
}
