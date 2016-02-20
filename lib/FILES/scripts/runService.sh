#!/bin/bash

function serviceSuccess()
{
    echo "service config preparation done successfully"

    export SOAJS_SRVIP=$(/sbin/ip route|awk '/172.17.0.0/ {print $9}')
    echo $SOAJS_SRVIP
    echo $SOAJS_ENV
    echo $SOAJS_PROFILE

    if [ -n "$SOAJS_GC_NAME" ]; then
    echo $SOAJS_GC_VERSION
    echo $SOAJS_GC_NAME
    fi

    node $1
}
function serviceFailure()
{
    echo "service config preparation failed"
}

node /opt/soajs/FILES/profiles/index.js &
b=$!
wait $b && serviceSuccess || serviceFailure