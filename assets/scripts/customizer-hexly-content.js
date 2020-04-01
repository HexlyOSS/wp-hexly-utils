jQuery(function($){
  
  const _ = lodash
  const parentClass = '.customize-control-content.hexly-content-control'
  wp.customize.bind( 'ready', function() {

    // expanding section
    wp.customize.section( 'ko2020_settings_homepage', function( section ) {
			section.expanded.bind( function( isExpanding ) {
        
      })
    })

    // expanding panel
		wp.customize.panel( 'ko2020_settings', function( section ) {
			section.expanded.bind( function( isExpanding ) {
        
			} );
		} );

    // wp.customize.previewer.bind( 'refresh', function() {
    //   console.log('refresh')
    //   // wp.customize.previewer.refresh();
    // } );

    // wp.customize.selectiveRefresh.bind( 'partial-content-rendered', function( placement ) {
    //   console.log('partial', placement)
    // } );
	} );




  function onReady(){
    $(parentClass).on('keyup', '[data-prop]', onChange)
    $(parentClass).on('change', '[data-prop]', onChange)
  }

  const refresh = _.debounce(function(parent){
    parent.trigger('change')
  }, 250)

  function onChange(e){
    const el = $(this) 
    const parent = el.closest(parentClass)

    const data = parent.find('[data-prop]')
        .toArray()
        .map($)
        .reduce( (carry, e) => ({
          ...carry, [e.attr('data-prop')]: e.val()
        }), {})

    const hidden = parent.find('textarea.hidden.serialized-prop')
    hidden.val(serialize(data))
    refresh(hidden)
  }
  $(document).on('ready', onReady)
  
  function serialize(e){var r,t,n,a="",i="",o=0,c=function(e){var r=0,t=0,n=e.length,a="";for(t=0;n>t;t++)a=e.charCodeAt(t),r+=128>a?1:2048>a?2:3;return r};switch(_getType=function(e){var r,t,n,a,i=typeof e;if("object"===i&&!e)return"null";if("object"===i){if(!e.constructor)return"object";n=e.constructor.toString(),r=n.match(/(\w+)\(/),r&&(n=r[1].toLowerCase()),a=["boolean","number","string","array"];for(t in a)if(n===a[t]){i=a[t];break}}return i},type=_getType(e),type){case"function":r="";break;case"boolean":r="b:"+(e?"1":"0");break;case"number":r=(Math.round(e)===e?"i":"d")+":"+e;break;case"string":r="s:"+c(e)+':"'+e+'"';break;case"array":case"object":r="a";for(t in e)if(e.hasOwnProperty(t)){if(a=_getType(e[t]),"function"===a)continue;n=t.match(/^[0-9]+$/)?parseInt(t,10):t,i+=serialize(n)+serialize(e[t]),o++}r+=":"+o+":{"+i+"}";break;case"undefined":default:r="N"}return"object"!==type&&"array"!==type&&("string"===type&&-1!==r.indexOf("}")||(r+=";")),r}
})