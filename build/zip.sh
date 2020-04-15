#!/bin/bash

if [ "$#" -ne 2 ]; then
    echo "Usage: build/zip.sh [cwd] [version]"
    exit 1
fi

echo "Zipping $2 from $1"
zip -qq -r "./wp-hexly-utils-$2.zip" $1 -x \*.git\* -x \*build\* -x \*composer.*\*
echo "Zipped!"