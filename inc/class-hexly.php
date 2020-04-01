<?php


if( class_exists('Hexly') ){
  // error_log('wp-hexly could not register class Hexly; already exists');
  return;
}

class Hexly {
  private static function doLog($level, $message, ...$args) {
    $debug = debug_backtrace()[1];
    $file = $debug['file'];
    $line = $debug['line'];

    if ( !is_string($message) ) {
      $args = array_merge([$message], $args);
      $message = '';
    }

    $printr = '';
    foreach ($args as $itr => $arg) {
      $printr = $printr . "\n===[start:  $itr]===\n\n" . print_r($arg, true) . "\n\n===[finish: $itr]===\n";
    }

    error_log("[$file:$line] [hexly:$level] $message $printr");
    $log = Logger::getLogger('hexly-logger');

    switch($level) {
      case "panic":
        $log->error("[$file:$line] $message $printr");
        break;
      case "error":
        $log->error("[$file:$line] $message $printr");
        break;
      case "debug":
        $log->debug("[$file:$line] $message $printr");
        break;
      case "info":
        $log->info("[$file:$line] $message $printr");
        break;
    }
  }

  public static function log($level, $message, ...$args) {
    Hexly::doLog($level, $message, ...$args);
  }

  public static function panic($message, ...$args) {
    // TODO trigger alarm bells here
    Hexly::doLog('panic', $message, ...$args);
  }

  public static function info($message, ...$args) {
    Hexly::doLog('info', $message, ...$args);
  }

  public static function warn($message, ...$args) {
    Hexly::doLog('warn', $message, ...$args);
  }

  public static function error($message, ...$args) {
    Hexly::doLog('error', $message, ...$args);
  }

  /**
   * Conditionally log debug statements, only if a string matched the end
   * of the caller's file exists in the HEXLY_LOG_DEBUG_FILES array.
   */
  public static function debug($message, ...$args) {
    if ( !defined('HEXLY_LOG_DEBUG_FILES') || empty(constant('HEXLY_LOG_DEBUG_FILES')) ) {
      return;
    }
    $debug = debug_backtrace()[0];
    $split = explode('wp-content/', $debug['file']);
    if ( count($split) > 1 ) {
      $file = $split[1];
      $paths = constant('HEXLY_LOG_DEBUG_FILES');
      foreach ($paths as $path) {
        $length = strlen($path);
        if ($length == 0) {
          return;
        }
        if ( (substr($file, -$length) === $path) ) {
          Hexly::doLog('debug', $message, ...$args);
        }
      }
    }
  }

  public static function dbpr($message, ...$args) {
    $debug = array_map( function($bt){
      return $bt['file'] . ':' . $bt['line'];
    }, debug_backtrace());

    Hexly::doLog('dbpr', $message, $debug, ...$args);
  }

  function uuid() {
    return sprintf( '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        // 32 bits for "time_low"
        mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ),

        // 16 bits for "time_mid"
        mt_rand( 0, 0xffff ),

        // 16 bits for "time_hi_and_version",
        // four most significant bits holds version number 4
        mt_rand( 0, 0x0fff ) | 0x4000,

        // 16 bits, 8 bits for "clk_seq_hi_res",
        // 8 bits for "clk_seq_low",
        // two most significant bits holds zero and one for variant DCE1.1
        mt_rand( 0, 0x3fff ) | 0x8000,

        // 48 bits for "node"
        mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff )
    );
  }
}

set_error_handler(function($errno, $errstr, $errfile, $errline ){
  Hexly::dbpr("Unhandled Error errno=$errno at " . $errfile . ':' . $errline, $errstr);
  // throw new ErrorException($errstr, $errno, 0, $errfile, $errline);
}, E_ERROR | E_WARNING | E_PARSE);


Hexly::info('sup dawg');