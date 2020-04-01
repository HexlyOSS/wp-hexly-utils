<?php 

/**
 * See https://www.ibenic.com/wordpress-customizer-flexible-list-control/
 */
class Hexly_Content_Control extends WP_Customize_Control {
  
  public $type = 'hexly_content';

  public function do_format_value($value, $id, $options){
    if( empty($value) ){
      // do nothing
    }else if( is_serialized($value) ){
      $value = unserialize($value);
    }

    if (!is_array($value)) {
      return null; // TODO probbaly something else here
    }

    
    $settings = $options['fields'] ?? [];

    $id_attr = '';
    if( !empty($id) ){
      $id_attr = 'data-id="' . $id . '"';
    }

    $output = '<div '  . $id_attr . ' class="hexly-content-control">';
    foreach($settings as $field => $opts ){
      $tag = $opts['tag'] ?? 'div';
      $component = $opts['component'];

      if( is_callable($component) && !is_string($component) ) {
        $called = $component($id, $field, $opts, $value);
        $output = $output . $called;
      }else if ($component == 'link') {
        $t = $value[$field . "[text]"] ?? '';
        
        $h = $value[$field . "[href]"] ?? '';
        $parsed = parse_url($h);
        if( $parsed === false || !array_key_exists('host', $parsed) ){
          $h = home_url($h);
        }
        
        if( !empty($t) || !empty($h) ){
          $classes = $opts['classes'] ?? '';
          $output = $output . "<a class=\"hc-link $classes\" href=\"$h\" data-field=\"$field\">$t</a>";
        }

      }else if($component == 'html'){
        $v = $value[$field];
        $output = $output . "<$tag class=\"hc-html $classes\" data-field=\"$field\">$v</$tag>";
      }else{
        $v = $value[$field] ?? '';
        $classes = $opts['classes'] ?? '';
        $output = $output . "<$tag class=\"hc-field $classes\" data-field=\"$field\">$v</$tag>";
      }
    }

    $output = $output  . '</div>';
    return $output;
  }
  
  public function format_value($value){
    return Hexly_Content_Control::do_format_value($value, $this->id, $this->options ?? []);
  }

  public function __construct( $manager, $id, $options=[], $args = array() ) {
    $this->options = $options;
    parent::__construct( $manager, $id, $args );
  }

  /**
   * Enqueue scripts/styles for the color picker.
   *
   * @since 3.4.0
   */
  public function enqueue() {
    wp_enqueue_script( 'lodash' );
    wp_enqueue_script( 'customizer-hexly-content-control', HEXLY_UTIL_PLUGIN_URL . '/assets/scripts/customizer-hexly-content.js');
    wp_enqueue_style( 'customizer-hexly-content-control-styles', HEXLY_UTIL_PLUGIN_URL . '/assets/styles/customizer-hexly-content.css');
  }

  /**
   * Don't render the control content from PHP, as it's rendered via JS on load.
   *
   * @since 3.4.0
   */
  public function render_content() {
    $serialized = $this->value();
    if ( is_serialized( $serialized ) ) {
      $value = unserialize( $serialized );
    }else{
      $value = [];
    }

    ?>
    <div class="customize-control-content hexly-content-control">
      <label>
        <?php if ( ! empty( $this->label ) ) : ?>
          <label class="customize-control-title"><?php echo esc_html( $this->label ); ?></label>
        <?php endif; ?>
      </label>
      <?php foreach($this->options['fields'] as $field => $opts ): ?>
        <?php $component = $opts['input'] ?? $opts['component'] ?? ''; ?>
        <?php if( $component == 'text' ): ?>
          <label class="hc-prop-label" data-hc-label="<?php echo $field ?>"> <?php echo esc_html( $opts['label'] ?? $field ); ?>
            <input type="text" data-prop="<?php echo $field ?>" value="<?php echo $value[$field] ?? '' ?>"/>
          </label>
        <?php elseif( $component == 'textarea' ): ?>
          <label class="hc-prop-label" data-hc-label="<?php echo $field ?>"> 
            <?php echo esc_html( $opts['label'] ?? $field ); ?>              
          </label>
          <textarea data-prop="<?php echo $field ?>"><?php echo $value[$field] ?? '' ?></textarea>
        <?php elseif( $component == 'link' ): ?>
          <label class="hc-prop-label" data-hc-label="<?php echo $field ?>"> <?php echo esc_html( $opts['label'] ?? $field ); ?></label>
          <input type="text" placeholder="Text" data-prop="<?php echo $field ?>[text]" value="<?php echo $value[$field . "[text]"] ?? '' ?>"/>
          <input type="text" placeholder="URL" data-prop="<?php echo $field ?>[href]" value="<?php echo $value[$field . '[href]'] ?? '' ?>"/>
        <?php elseif( $component == 'html'): ?>
          <?php // TODO CLEAN THIS UP ?>
          <?php $el_id = uniqid(); ?>
          <label class="hc-prop-label" data-hc-label="<?php echo $field ?>"> 
            <?php echo esc_html( $opts['label'] ?? $field ); ?>              
          </label>
          <textarea id="<?php echo $el_id ?>"  data-prop="<?php echo $field ?>"><?php echo $value[$field] ?? '' ?></textarea>
          <script type="text/javascript"> 
            jQuery(function(){ 
              const settings = wp.editor.getDefaultSettings()
              settings.tinymce.init_instance_callback = function(editor) {
                const textarea = jQuery('#' + editor.id)
                const update = lodash.debounce(function(){
                  textarea.trigger('keyup')
                }, 500)
                editor.on('change', function () {
                  editor.save();
                  update()
                });
              }
              wp.editor.initialize("<?php echo $el_id ?>", settings)
            })
          </script>
          
        <?php endif; ?>
      <?php endforeach; ?>
      <textarea <?php echo $this->link(); ?> class="serialized-prop hidden" style="display: none" id="<?php echo $this->id; ?>" name="<?php echo $this->id; ?>"><?php echo $serialized ?></textarea>
    </div>
    <?php
  }
}