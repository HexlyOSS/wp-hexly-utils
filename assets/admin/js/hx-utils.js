jQuery(function($){
  const dpDefaults = {
    altFormat: 'yy-mm-dd',
    dateFormat: 'yy-mm-dd'
  }
  $('input.date-picker').each(function(){
    const el = $(this)
    const options = el.data('options') || dpDefaults
    el.datepicker( typeof(options) === 'string' ? JSON.parse(options) : options)
  })


  $('.hx-select2').select2();
});
