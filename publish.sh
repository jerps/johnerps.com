#!/bin/bash


# If first parm includes an "F" and/or "I" then fonts and/or images, resp., are also published.


FTPS=.ftps

HOST=johnerps.com
USER=john@johnerps.com

LDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"

DIR_CSS=css
DIR_JS=js
DIR_IMAGES=images
DIR_IMAGES_FLOAT=images/float
DIR_INCLUDE="include"
DIR_PHP=php
DIR_PHP_PRIV=php/priv
DIR_FONTS=fonts
DIR_FONTS_FONTAWESOME=fonts/fontawesome-free-5.10.2-web
DIR_FONTS_FONTAWESOME_CSS=fonts/fontawesome-free-5.10.2-web/css
DIR_FONTS_FONTAWESOME_JS=fonts/fontawesome-free-5.10.2-web/js
DIR_FONTS_FONTAWESOME_WEBFONTS=fonts/fontawesome-free-5.10.2-web/webfonts
DIR_FONTS_GOOGLE=fonts/google-webfonts

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
mputdir $DIR_JS
mputdir $DIR_INCLUDE
mputdir $DIR_PHP
mputdir $DIR_PHP_PRIV

if [[ $1 == *F* ]]
then
  mputdir $DIR_FONTS
  mputdir $DIR_FONTS_FONTAWESOME
  mputdir $DIR_FONTS_FONTAWESOME_CSS
  mputdir $DIR_FONTS_FONTAWESOME_JS
  mputdir $DIR_FONTS_FONTAWESOME_WEBFONTS
  mputdir $DIR_FONTS_GOOGLE
fi

if [[ $1 == *I* ]]
then
  mputdir $DIR_IMAGES b
  mputdir $DIR_IMAGES_FLOAT b
fi

echo "quit"                    >> $FTPS

ftp $HOST --verbose < $FTPS
