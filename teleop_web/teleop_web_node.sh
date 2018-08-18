#!/bin/bash

if [ $# -eq 0 ]; then
    echo "Missing file to start"
    exit -1
fi

cd $1

node $1/src/main.js
