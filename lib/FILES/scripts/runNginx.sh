#!/bin/bash

function nxSuccess()
{
    echo "nginx config preparation done successfully"
    service nginx start
}
function nxFailure()
{
    echo "nginx config preparation failed"
}

node /opt/soajs/FILES/nginx/index.js &
b=$!
wait $b && nxSuccess || nxFailure