<?php

// (c) 2019 John Erps

// See LICENSE.


$url = $_GET["url"];
$logbytes = filesize("getfile.log");
$log = fopen("getfile.log", $logbytes != false && $logbytes > 10*1024*1024 ? "w" : "a");
date_default_timezone_set('Europe/Amsterdam');
fputs($log, date('Y/m/d H:i:s'));
fputs($log, ' - ');
fputs($log, $url);
$content = file_get_contents($url);
$hdrs = array('HTTP/1.1 400 Bad request');
!empty($http_response_header) && $hdrs = $http_response_header;
$hdrs = parseHeaders($hdrs);
$rc = 400;
if (isset($hdrs['response_code'])) {
  $rc = $hdrs['response_code'];
}
$orc = $rc;
if ($rc != 200 && $rc != 400 && $rc != 401 && $rc != 403 && $rc != 404 && $rc != 500) {
  $rc = 400;
}
http_response_code($rc);
header("Content-Type: text/plain; charset=utf-8");
header('Access-Control-Allow-Origin: *');
if ($rc != 200) {
  fputs($log, "  -->  RC ".strval($orc).' ('.strval($rc).'->)');
} else if ($content == false) {
  fputs($log, "  -->  NO CONTENT");
} else {
  fputs($log, "  -->  OK");
  echo $content;
}
fputs($log, "\n");
fclose($log);

function parseHeaders($headers) {
  $head = array();
  foreach($headers as $k=>$v) {
    $t = explode(':', $v, 2);
    if (isset($t[1])) {
      $head[trim($t[0])] = trim($t[1]);
    } else {
      $head[] = $v;
      if (preg_match( "#HTTP/[0-9\.]+\s+([0-9]+)#", $v, $out)) {
        $head['response_code'] = intval($out[1]);
      }
    }
  }
  return $head;
}
?>
