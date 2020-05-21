<?php

class HexlyParseUtils {

  public static function parseFloat($val, $default = null){
    if(is_numeric($val)){
      return floatval($val);
    }else if($default == null){
      return $default;
    }else{
      return floatval($default);
    }
  }

  public static function parseInt($val, $default = null){
    if(is_numeric($val)){
      return intval($val);
    }else if($default == null){
      return $default;
    }else{
      return intval($default);
    }
  }
}