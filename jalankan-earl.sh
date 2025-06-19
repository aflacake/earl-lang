#!/bin/bash

if ! command -v node &> /dev/null
then
    echo "Node.js belum terinstal. Silahkan install Node.js terlebih dahulu."
    exit 1
fi

if [ "$#" -eq 1 ]; then
    node index.js "$1"
else
    node index.js
fi

