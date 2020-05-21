<?php

class HexlyParseUtils {

  public static function parseFloat($val, $default = null){
    return is_numeric($val) ? floatval($val) : ($default == null ? null : floatval($default));
  }

  public static function parseInt($val, $default = null){
    return is_numeric($val) ? intval($val) : ($default == null ? null : intval($default));
  }
}