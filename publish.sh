#!/bin/bash

FTPS=.ftps

HOST=johnerps.com
USER=john@johnerps.com

LDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"

DIR_CSS=css
DIR_DIST=dist
DIR_IMAGES=images
DIR_IMAGES_FLOAT=images/float
DIR_INCLUDE="include"
DIR_PHP=php
DIR_PHP_PRIV=php/priv

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

echo "$USER"                    > $FTPS
echo "prompt"                  >> $FTPS
echo "ascii"                   >> $FTPS
echo "lcd $LDIR"               >> $FTPS
echo "cd /"                    >> $FTPS
echo "put index.html"          >> $FTPS
echo "put php.ini"             >> $FTPS

mputdir $DIR_CSS
mputdir $DIR_DIST
mputdir $DIR_INCLUDE
mputdir $DIR_PHP
mputdir $DIR_PHP_PRIV

if [ $1 = I ]
then
  mputdir $DIR_IMAGES b
  mputdir $DIR_IMAGES_FLOAT b
fi

echo "quit"                    >> $FTPS

ftp $HOST --verbose < $FTPS
