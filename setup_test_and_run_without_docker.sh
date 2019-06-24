#!/usr/local/bin/bash

sh setup.sh

mocha --require ts-node/register **/*.spec.ts

cd ./dist

node main.js