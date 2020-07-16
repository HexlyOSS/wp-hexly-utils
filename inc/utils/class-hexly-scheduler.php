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
}