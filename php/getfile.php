<?php
@$uri = $_GET["uri"];
@$logbytes = filesize("getfile.log");
$log = fopen("getfile.log", $logbytes != false && $logbytes > 10*1024*1024 ? "w" : "a");
fputs($log, $uri);
@$content = file_get_contents($uri);
header("Content-Type: text/plain; charset=utf-8");
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
