jQuery(document.body).ready(disableSubmitBtn);
jQuery(document.body).on('applied_coupon', function () {
  location.reload();
});

function disableSubmitBtn () {
  if (typeof params === 'undefined') {
    return;
  }
  var selectElement = jQuery('#gift-variants-select');

  if (!selectElement.length) {
    return;
  }
  console.log({ selectElement });
  var { ajaxUrl, giftItemCode } = params;
  console.log({ ajaxUrl, giftItemCode });
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
      console.log({ res });
      location.reload();
    })
  })
}
