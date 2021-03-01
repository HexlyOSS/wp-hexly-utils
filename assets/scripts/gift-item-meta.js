jQuery(document.body).ready(couponAjax);
jQuery(document.body).on('applied_coupon', function () {
  location.reload();
});

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
