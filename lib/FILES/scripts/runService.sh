#!/bin/bash

service=$1
IP_SUBNET=$3
SET_SOAJS_SRVIP=$2
function serviceSuccess()
{
    echo "service config preparation done successfully"

    if [ ${SET_SOAJS_SRVIP} == "on" ]; then
        export SOAJS_SRVIP=$(/sbin/ip route|awk '/${IP_SUBNET}/ {print $9}')
        echo $SOAJS_SRVIP
    fi
    echo $SOAJS_ENV
    echo $SOAJS_PROFILE

    if [ -n "$SOAJS_GC_NAME" ]; then
    echo $SOAJS_GC_VERSION
    echo $SOAJS_GC_NAME
    fi

    echo "about to run service ${1}"
    node ${service}
}
function serviceFailure()
{
    echo "service config preparation failed"
}

node /opt/soajs/FILES/deployer/profile.js &
b=$!
wait $b && serviceSuccess || serviceFailure