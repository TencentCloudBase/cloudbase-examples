#!/bin/bash

rm -rf .zip-files
mkdir .zip-files

echo "Search Directory to Package"

for dir in `find * -mindepth 1 -maxdepth 1 -type d`; do
    zip -r .zip-files/${dir##*/}.zip $dir
done