#!/bin/bash

[ ${SOAJS_DEPLOY_DIR} ] && LOC=${SOAJS_DEPLOY_DIR} || LOC='/opt/tmp/'

[ ${1} ] && DEPLOY_FROM=${1} || DEPLOY_FROM='LOCAL'
WRK_DIR=${LOC}'soajs/node_modules'
GIT_BRANCH="develop"

function program_is_installed(){
  # set to 1 initially
  local return_=1
  # set to 0 if not found
  type $1 >/dev/null 2>&1 || { local return_=0; }
  # return value
  echo "$return_"
}
function init(){
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
}

function importData(){
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
}

function startDashboard(){
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

function uracSuccess(){
    if [ ${DEPLOY_FROM} == "NPM" ]; then
        npm install soajs.oauth
        npm install soajs.GCS
        npm install soajs.examples
    elif [ ${DEPLOY_FROM} == "GIT" ]; then
        git clone git@github.com:soajs/soajs.oauth.git --branch ${GIT_BRANCH}
        git clone git@github.com:soajs/soajs.GCS.git --branch ${GIT_BRANCH}
        git clone git@github.com:soajs/soajs.examples.git --branch ${GIT_BRANCH}
    else
        exit -1
    fi
    startDashboard
}
function uracFailure(){
    echo $'\n ... unable to install urac npm package. exiting!'
    exit -1
}
function dashSuccess(){
    if [ ${DEPLOY_FROM} == "NPM" ]; then
        npm install soajs.urac
    elif [ ${DEPLOY_FROM} == "GIT" ]; then
        git clone git@github.com:soajs/soajs.urac.git --branch ${GIT_BRANCH}
    else
        exit -1
    fi
    b=$!
    wait $b && uracSuccess || uracFailure
}
function dashFailure(){
    echo $'\n ... unable to install dashboard npm package. exiting!'
    exit -1
}
function controllerSuccess(){
    if [ ${DEPLOY_FROM} == "NPM" ]; then
        npm install soajs.dashboard
    elif [ ${DEPLOY_FROM} == "GIT" ]; then
        git clone git@github.com:soajs/soajs.dashboard.git --branch ${GIT_BRANCH}
    else
        exit -1
    fi
    b=$!
    wait $b && dashSuccess || dashFailure
}
function controllerFailure(){
    echo $'\n ... unable to install controller npm package. exiting!'
    exit -1
}
function soajsSuccess(){
    if [ ${DEPLOY_FROM} == "NPM" ]; then
        npm install soajs.controller
    elif [ ${DEPLOY_FROM} == "GIT" ]; then
        git clone git@github.com:soajs/soajs.controller.git --branch ${GIT_BRANCH}
    else
        exit -1
    fi
    b=$!
    wait $b && controllerSuccess || controllerFailure
}
function soajsFailure(){
    echo $'\n ... unable to install soajs npm package. exiting!'
    exit -1
}
function exec(){
    mkdir -p ${WRK_DIR}
    pushd ${WRK_DIR}
    export NODE_ENV=production
    if [ ${DEPLOY_FROM} == "NPM" ]; then
        npm install soajs
        b=$!
        wait $b && soajsSuccess || soajsFailure
    elif [ ${DEPLOY_FROM} == "GIT" ]; then
        git clone git@github.com:soajs/soajs.git --branch ${GIT_BRANCH}
        b=$!
        wait $b && soajsSuccess || soajsFailure
    elif [ ${DEPLOY_FROM} == "LOCAL" ]; then
        startDashboard
    else
        echo $'\nYou are trying to deploy from ['${LOCAL}']!'
        echo $'\n ... Deploy from must be one of the following [ NPM || GIT || LOCAL ]'
        exit -1
    fi
}

init
importData
exec
