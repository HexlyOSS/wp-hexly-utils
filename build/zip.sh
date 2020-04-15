#!/bin/bash

if [ "$#" -lt 2 ]; then
    echo "Usage: build/zip.sh <zip_file> <cwd> [project] [version]"
    exit 1
fi

echo "Zipping to $2 to $1"
zip -qq -r "$1" "$2" -x \*.git\* -x \*build\* -x \*composer.*\*
echo "Zipped!"