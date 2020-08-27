<?php

$fields = apply_filters($hook_prefix . 'fields', $item->get_fields(), $item, $type);
// no fields = don't render anything
if( empty($fields) ){
  return;
}
?>

<?php echo $nonce;?>

<?php do_action($hook_prefix . 'before_table', $item, $type) ?>

<table class="hx-generic-entity-form-fields" style="width: 100%">
	<!-- <thead>
    <tr>
      <th class="left">Field</th>
      <th>Value</th>
    </tr>
  </thead> -->
  <?php do_action($hook_prefix . 'after_table_tbody', $item, $type) ?>
	<tbody>
    <?php
    foreach($fields as $id => $field ){

      // parse our info
      $value = $item->{"get_$id"}('edit');
      $fields = apply_filters($hook_prefix . 'value', $label, $item, $type);

      $label = $field['label'];
      $fields = apply_filters($hook_prefix . 'label', $label, $item, $type, $value);


      // define some args for hooks
      $row_args = [$id, $field, $item, $type, &$label, &$value];

      do_action($hook_prefix . 'table_before_row', ...$row_args);
      echo "<tr>";
      do_action($hook_prefix . 'table_after_row_open', ...$row_args);

      if( $field['editable'] ){
        switch($field['type']){
          case 'checkbox':
            echo '<td><label for="' . $id . '" style="display:inline;"><b>' . $label . '</b></label>&nbsp;&nbsp;</td>';
            echo '<td><input type="checkbox" name="' . $id . '" id="' . $id . '" value="yes"</td>';
            if ($value == "yes" || $value == "true") {
                echo ' checked="checked"';
            }
            echo '" style="width: auto;" />';
            break;

          case "textarea":
          case "wysiwyg":
              // Text area
              echo '<td><label for="' . $id .'"><b>' . $customField[ 'title' ] . '</b></label></td>';
              echo '<td><textarea name="' . $id . '" id="' . $id . '" columns="30" rows="3">' . htmlspecialchars($meta_value) . '</textarea></td>';
              // WYSIWYG
              if ($customField[ 'type' ] == "wysiwyg") { ?>
                  <script type="text/javascript">
                      jQuery( document ).ready( function() {
                          jQuery( "<?php echo $id; ?>" ).addClass( "mceEditor" );
                          if ( typeof( tinyMCE ) == "object" && typeof( tinyMCE.execCommand ) == "function" ) {
                              tinyMCE.execCommand( "mceAddControl", false, "<?php echo $id; ?>" );
                          }
                      });
                  </script>
              <?php }
              break;

          default: {

            $dt = 'text';
            $args = '';
            if( in_array($type, ['int', 'float']) ){
              $dt = 'number';
              if( $type == 'float' ){
                $args = ''; // TODO decimal support
              }
            }
            // Plain text field
            echo '<td><label for="' . $id .'"><b>' . $label . '</b></label></td>';
            echo '<td><input type="' . $dt . '" name="' . $id . '" id="' . $id . '" value="' . htmlspecialchars( $value) . '" ' . $args . '  /></td>';
            break;
          }
        }
      }else {
        echo '<td><label><b>' . $label . '</b></label></td>';
        echo '<td><input name=' . $id . ' readonly="readonly" type="text" value="' . htmlspecialchars( $value ) . '") /></td>';
      }



      do_action($hook_prefix . 'table_before_row_close', ...$row_args);

      echo "</tr>";

      do_action($hook_prefix . 'table_after_row', ...$row_args);
    }
    ?>
  </tbody>
  <?php do_action($hook_prefix . 'after_table_tbody', $item, $type) ?>
</table>

<?php do_action($hook_prefix . 'after_table', $item, $type) ?>

<?php
