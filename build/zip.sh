#!/bin/bash

if [ "$#" -lt 2 ]; then
    echo "Usage: build/zip.sh <zip_file> <cwd> [project] [version]"
    exit 1
fi

echo "Zipping from $2 to $1"
cd "$2"
cd ..
zip -qq -r "$1" "$3" -x \*.git\* -x \*build\* -x \*composer.*\*
echo "Zipped!"