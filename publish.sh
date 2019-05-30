#!/bin/bash

FTPS=ftp.txt

HOST=johnerps.com
USER=john@johnerps.com

LDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"

DIR_CSS=css
DIR_IMAGES=images
DIR_IMAGES_FLOAT=images/float
DIR_INCLUDE=include
DIR_JS=js
DIR_PHP=php
DIR_PHP_PRIV=php/priv
DIR_WC=wc

function mputdir {
  case "$2" in
    b ) echo "bin"             >> $FTPS;;
    * ) echo "ascii"           >> $FTPS;;
  esac
  echo "lcd $LDIR"             >> $FTPS
  echo "lcd $1"                >> $FTPS
  echo "cd /"                  >> $FTPS
  echo "mkdir $1"              >> $FTPS
  echo "cd $1"                 >> $FTPS
  echo "mput *"                >> $FTPS
}

echo "open $HOST"               > $FTPS
echo "$USER"                   >> $FTPS
echo "prompt"                  >> $FTPS
echo "ascii"                   >> $FTPS
echo "mput *"                  >> $FTPS

mputdir $DIR_CSS
mputdir $DIR_INCLUDE
mputdir $DIR_JS
mputdir $DIR_PHP
mputdir $DIR_PHP_PRIV
mputdir $DIR_WC

if [ $1 = I ]
then
  mputdir $DIR_IMAGES b
  mputdir $DIR_IMAGES_FLOAT b
fi

echo "quit"                    >> $FTPS

ftp --verbose < $FTPS