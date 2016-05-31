#!/bin/bash

MONGO_URL='iad1-mongos0.objectrocket.com'
MONGO_PORT=16067
MONGO_USERNAME=''
MONGO_PASSWORD=''


function readMongoInfo(){
    echo $'\n PLease enter MongoDB Host. Default [iad1-mongos0.objectrocket.com]:'
    read URL
    if [ -n "${URL}" ]; then
        MONGO_URL = ${URL}
    fi
    echo $'\n PLease enter MongoDB Port. Default [16067]:'
    read PORT
    if [ -n "${PORT}" ]; then
        MONGO_PORT = ${PORT}
    fi
    echo $'\n PLease enter MongoDB Username. Default [NULL]:'
    read UNAME
    if [ -n "${UNAME}" ]; then
        MONGO_USERNAME = ${UNAME}
    fi
    echo $'\n PLease enter MongoDB Password. Default [NULL]:'
    read PWD
    if [ -n "${PWD}" ]; then
        MONGO_PASSWORD = ${PWD}
    fi

    echo $'\n Your mongo info are:'
    echo $'\t HOST: '${MONGO_URL}
    echo $'\t PORT: '${MONGO_PORT}
    echo $'\t USERNAME: '${MONGO_USERNAME}
    echo $'\t PASSWORD: '${MONGO_PASSWORD}

    while true; do
        read -p "Do you wish to continue with the above Mongo Info ([n] to go back and change)? " yn
        case $yn in
            [Yy]* ) echo $'\n ..... Continue'; break;;
            [Nn]* ) readMongoInfo; break;;
            * ) echo "Please answer yes or no.";;
        esac
    done
}

readMongoInfo

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