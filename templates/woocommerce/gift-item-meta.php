<?php
/**
 * Gift Item Selection
 *
 * @package Hexly
 * @version 3.5.0
 */

defined( 'ABSPATH' ) || exit;
?>

<dl>
	<select id="gift-variants-select" name="gift-variants">
    <option value="0">PLEASE SELECT A SIZE</option>
    <?php foreach($children_names as $el) : ?>
      <option value="<?php echo $el['id']?>"><?php echo $el['name'] ?></option>
    <?php endforeach; ?>
  </select>
</dl>
