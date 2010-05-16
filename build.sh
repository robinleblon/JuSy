#!/bin/bash

# Concatenates and minifies all sourcefiles using the Google Closure Compiler.
# Also supplies a list of files to be pasted in a html <head> for including all original files (for debugging purposes)

SRCDIR="js"
OUTPUTFILE="jusy.min.js"

PREFIX=" --js="

FILES=`find $SRCDIR -name '*.js'`
BUILD=""
HTMLINCLUDE=""

for FILE in $FILES; do 
    BUILD=$BUILD$PREFIX$FILE
    HTMLINCLUDE=$HTMLINCLUDE'<script src="'$FILE'" type="text/javascript"></script>\n'
done

COMMAND="java -jar compiler.jar "$BUILD" --js_output_file=$OUTPUTFILE"

echo -e "\nCompiling with command"
echo -e "======================"
echo -e $COMMAND
echo -e "\nInclude in html <head>"
echo -e "======================"
echo -e $HTMLINCLUDE

$COMMAND