<?php

class HX_Scheduler {

  public static function ensure_scheduled($time, $task_name, $callable, $interval, $args = [], $group = 'hx'){
    if ( as_next_scheduled_action( $task_name ) === false ) {
      as_schedule_recurring_action( $time, $interval, $task_name, $args, $group );
    }
    add_action( $task_name, $callable );
  }

  public static function release_scheduled($task_name){
    as_unschedule_all_actions($task_name);
  }

  public static function run_async($task_name, $args, $group = 'hx'){
    $ts = current_time( 'timestamp', true );
    // Hexly::info("scheduled $hook to run later $ts", $args);
    $id = as_schedule_single_action($ts + 5, $task_name, $args, $group);

    return $id;
  }
}