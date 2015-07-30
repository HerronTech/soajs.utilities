#!/usr/bin/env bash

WRK_DIR='/opt/tmp/soajs/node_modules'

function program_is_installed {
  # set to 1 initially
  local return_=1
  # set to 0 if not found
  type $1 >/dev/null 2>&1 || { local return_=0; }
  # return value
  echo "$return_"
}
echo $'Initializing and checking prerequisites ... '
PRE_EXIT=0
_SW_CHECK=$(program_is_installed node)
if [ ${_SW_CHECK} == 0 ]; then
    echo $'\n ... Unable to find docker on your machine. PLease install node!'
    PRE_EXIT=1
fi
_SW_CHECK=$(program_is_installed mongo)
if [ ${_SW_CHECK} == 0 ]; then
    echo $'\n ... Unable to find docker on your machine. PLease install mongo!'
    PRE_EXIT=1
fi
_SW_CHECK=$(program_is_installed nginx)
if [ ${_SW_CHECK} == 0 ]; then
    echo $'\n ... Unable to find docker on your machine. PLease install nginx!'
    PRE_EXIT=1
fi
_SW_CHECK=$(program_is_installed npm)
if [ ${_SW_CHECK} == 0 ]; then
    echo $'\n ... Unable to find docker on your machine. PLease install npm!'
    PRE_EXIT=1
fi

if [ ${PRE_EXIT} == 1 ]; then
    exit -1
fi

mongo --eval "db.stats()"
RESULT=$?
if [ $RESULT -ne 0 ]; then
    echo $'\n ...mongodb not running. PLease start mongodb!'
    exit -1
else
    echo $'\n mongodb running! continue...'
fi

echo $'\n1- Importing core provisioned data ...'
node index data import provision
echo $'\n2- Importing URAC data...'
node index data import urac
echo $'\n--------------------------'

mkdir -p ${WRK_DIR}
pushd ${WRK_DIR}

function startDashboard()
{
    pushd soajs.controller
    node . &
    popd
    pushd soajs.urac
    node . &
    popd
    pushd soajs.dashboard
    node . &
    popd

    ps aux | grep node
    echo "DONE"
}

function uracSuccess()
{
    npm install soajs.oauth
    npm install soajs.GCS
    npm install soajs.examples
    startDashboard
}
function uracFailure()
{
    echo $'\n ... unable to install urac npm package. exiting!'
    exit -1
}
function dashSuccess()
{
    npm install soajs.urac
    b=$!
    wait $b && uracSuccess || uracFailure
}
function dashFailure()
{
    echo $'\n ... unable to install dashboard npm package. exiting!'
    exit -1
}
function controllerSuccess()
{
    npm install soajs.dashboard
    b=$!
    wait $b && dashSuccess || dashFailure
}
function controllerFailure()
{
    echo $'\n ... unable to install controller npm package. exiting!'
    exit -1
}
function soajsSuccess()
{
    npm install soajs.controller
    b=$!
    wait $b && controllerSuccess || controllerFailure
}
function soajsFailure()
{
    echo $'\n ... unable to install soajs npm package. exiting!'
    exit -1
}

export NODE_ENV=production
npm install soajs
b=$!
wait $b && soajsSuccess || soajsFailure
