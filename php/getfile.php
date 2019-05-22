<?php

// (c) 2019 John Erps

// See LICENSE.


$url = $_GET["url"];
$logbytes = filesize("getfile.log");
$log = fopen("getfile.log", $logbytes != false && $logbytes > 10*1024*1024 ? "w" : "a");
fputs($log, $url);
$content = file_get_contents($url);
header("Content-Type: text/plain; charset=utf-8");
header('Access-Control-Allow-Origin: *');
if ($content == false) {
  fputs($log, "  -->  FAIL");
} else {
  fputs($log, "  -->  OK::");
  $l = strlen($content);
  if ($l > 0) {
    if ($l > 200) {
      $l = 200;
    }
    fputs($log, preg_replace('!\s+!', ' ', substr($content, 0, $l)));
    echo $content;
  }
}
fputs($log, "\n");
fclose($log);
?>
