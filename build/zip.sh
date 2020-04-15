#!/bin/bash

if [ "$#" -ne 3 ]; then
    echo "Usage: build/zip.sh [cwd] [project] [version]"
    exit 1
fi

echo "Zipping to $2 to $1"
zip -qq -r "$1" "$2" -x \*.git\* -x \*build\* -x \*composer.*\*
echo "Zipped!"