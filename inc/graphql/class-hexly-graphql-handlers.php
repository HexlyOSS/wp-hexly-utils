<?php





add_action( 'graphql_process_http_request_response', function($response, $result, $operation_name, $query, $variables){
  if( $response->errors ){
    foreach( $response->errors as $err ){
      $pathIdx = 1;
      $path = array_reduce( $err->path ?? [], function($prev, $next) use (&$pathIdx) {
        return "$prev " . str_repeat('  ', $pathIdx++ ) . '--> ' . $next . "\n";
      }, '');


      $error = $err->getMessage();
      $trace = explode("\n", $err->getTraceAsString());
      Hexly::warn("GraphQL Error at $error\n\nGraphQL Path:\n$path", $trace);
    }
  }
}, 10, 5 );