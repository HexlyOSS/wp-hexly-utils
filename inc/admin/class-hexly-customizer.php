<?php 


require_once( ABSPATH . WPINC . '/class-wp-customize-setting.php' );
require_once( ABSPATH . WPINC . '/class-wp-customize-section.php' );
require_once( ABSPATH . WPINC . '/class-wp-customize-control.php' );

// module requires here
require_once( 'class-hexly-base-customizer.php');
require_once( 'controls/class-hexly-content-control.php');

class HexlyCustomizer {

  private $cache = [];
  private $registered = false;

  public function __construct(){
    add_action("customize_register", [$this, "customize_register"], 11);
    // add_action("init", [$this, "customize_register"]);
  }

  function customize_register(){
    global $wp_customize;
    
    if( $this->registered ){
      // Hexly::info('Registered already', $this->cache);
      return;
    }

    $this->init_panel($wp_customize);

    
    foreach( array_keys($this->cache) as $id ){
      $c = $this->cache[$id];
      $blah = $c['init']($wp_customize);
    }
    $this->registered = true;
  }


  public function init_panel($wp_customize){
    $wp_customize->add_panel( 'hexly', array(
      'title' => __( 'Hexly', 'hexly-utils' ),
      'description' => 'Hexly Settings / Configurations',
      'priority' => 1,
    ) );
  }


  function lookup_and_format($id, $value){
    $data = $this->cache[$id];
    $output = Hexly_Content_Control::do_format_value($value, $id, $data['options'] ?? []);
    return $output;
  }

  function register_content_control($id, $settings, $options, $args){
    $this->cache[$id] = [
      'settings' => $setting, 
      'options' => $options, 
      'args' => $args,
      'init' => function($wp_customize) use ( $id, $settings, $options, $args ) {
        $wp_customize->add_setting( 
          $settings['id'] ?? $id,
          array_merge([ 
            "capability"     => "edit_theme_options",
            'transport'         => 'postMessage',
          ], $settings['args'] ?? [] )
        );

        $control = new Hexly_Content_Control($wp_customize, $id, $options, $args);
        $wp_customize->add_control($control);
        $wp_customize->selective_refresh->add_partial("$id-partial", array(
          'selector' => ".hexly-content-control[data-id=\"$id\"]",
          'settings' => [ $id ],
          'render_callback' => function($arg, $arg2) use ( $id, $wp_customize, $control ) {
            // TODO: why does this sometimes work? 
            // $changes = $wp_customize->changeset_data();
            // $key = $wp_customize->get_stylesheet() . "::{$homepage_section}[section_1]";
            // $value = $changes[$key] ?? null;


            $value = json_decode(stripslashes($_POST['customized']), true);
            $output = $control->format_value($value[$id] ?? null);            
            echo $output;
          },
        ) );

        $this->cache[$id]['control'] = $control;
        return $control;
      }
    ];
  }
}
global $hexly_customizer;
$hexly_customizer = new HexlyCustomizer();