#!/bin/bash

MONGO_URL='127.0.0.1'
MONGO_PORT=27017
MONGO_USERNAME=''
MONGO_PASSWORD=''

CMD1=${MONGO_URL}':'${MONGO_PORT}/'core_provision'
CMD2=${MONGO_URL}':'${MONGO_PORT}/'DBTN_urac'

if [-z ${MONGO_USERNAME} ]; then
	CMD1=''${CMD1}' -u '${MONGO_USERNAME}' -p '${MONGO_PASSWORD}
	CMD2=''${CMD2}' -u '${MONGO_USERNAME}' -p '${MONGO_PASSWORD}
fi

pushd ./provision/

echo $'\nCMD1: mongo '${CMD1}' ./data.js'
mongo ${CMD1} ./data.js
echo $'\nCMD2: mongo '${CMD2}' ./urac.js'
mongo ${CMD2} ./urac.js
popd