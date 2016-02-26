#!/bin/bash

[ ${SOAJS_DEPLOY_DIR} ] && LOC=${SOAJS_DEPLOY_DIR} || LOC='/Users/'
[ ${SOAJS_DEPLOY_LOCAL_SRC} ] && LOC=${SOAJS_DEPLOY_LOCAL_SRC} || LOC_LOCAL_SRC='/opt/soajs/node_modules/'

[ ${1} ] && DEPLOY_FROM=${1} || DEPLOY_FROM='NPM'
WRK_DIR=${LOC}'soajs/'
SRC_DIR=${WRK_DIR}'src/node_modules/'
GIT_BRANCH="develop"
DATA_CONTAINER='soajsData'
IMAGE_PREFIX='soajsorg'
NGINX_CONTAINER='nginx'
MASTER_DOMAIN='soajs.org'
IP_SUBNET="172.17.0.0"
SET_SOAJS_SRVIP="off"

function createContainer(){
    local WHAT=${1}
    local ENV='-e NODE_ENV=production -e SOAJS_ENV=dashboard -e SOAJS_PROFILE=/opt/soajs/FILES/profiles/profile.js -e SOAJS_SRV_AUTOREGISTERHOST=true -e SOAJS_MONGO_NB=1 -e SOAJS_MONGO_IP_1='${MONGOIP}''
    local VLM='-v '${LOC}'soajs/open_source/services/'${WHAT}':/opt/soajs/node_modules/'${WHAT}''

    echo $'- Starting Controller Container '${WHAT}' ...'

    if [ ${WHAT} == "dashboard" ]; then
        local EXTRA='-e SOAJS_PROFILE_LOC=/opt/soajs/FILES/profiles/ -e SOAJS_ENV_WORKDIR='${LOC}' -v '${LOC}'soajs:'${LOC}'soajs -v /var/run/docker.sock:/var/run/docker.sock'
        docker run -d ${ENV} ${VLM} ${EXTRA} -i -t --name ${WHAT} ${IMAGE_PREFIX}/soajs bash -c 'cd /opt/soajs/node_modules/'${WHAT}'/; npm install; /opt/soajs/FILES/scripts/runService.sh /opt/soajs/node_modules/'${WHAT}/'index.js '${SET_SOAJS_SRVIP}' '${IP_SUBNET}
    else
        docker run -d ${ENV} ${VLM} -i -t --name ${WHAT} ${IMAGE_PREFIX}/soajs bash -c 'cd /opt/soajs/node_modules/'${WHAT}'/; npm install; /opt/soajs/FILES/scripts/runService.sh /opt/soajs/node_modules/'${WHAT}'/index.js '${SET_SOAJS_SRVIP}' '${IP_SUBNET}
    fi
}

function program_is_installed(){
  # set to 1 initially
  local return_=1
  # set to 0 if not found
  type $1 >/dev/null 2>&1 || { local return_=0; }
  # return value
  echo "$return_"
}

function init(){
    ###################################
    #SOAJSDATA container
    ###################################
    echo $'Initializing and checking prerequisites ... '
    SOAJS_DATA_VLM='-v '${LOC}'soajs/data:/data -v '${LOC}'soajs/data/db:/data/db'
    DOCKER=$(program_is_installed docker)
    if [ ${DOCKER} == 0 ]; then
        echo $'\n ... Unable to find docker on your machine. PLease install docker!'
        exit -1
    fi
    docker ps -a
    echo $'\n1- Cleaning previous docker containers ...'
    docker stop $(docker ps -a -q)
    sleep 1
    docker rm $(docker ps -a -q)
    echo $'\n--------------------------'
}

function importData(){
    ###################################
    # IMPORT DATA
    ###################################
    echo $'\n2- Starging Mongo Container "soajsData" ...'
    docker run -d -p 27017:27017 ${SOAJS_DATA_VLM} --name ${DATA_CONTAINER} mongo mongod --smallfiles
    echo $'\n--------------------------'
    #get mongo container IP address
    MONGOIP=`docker inspect --format '{{ .NetworkSettings.IPAddress }}' ${DATA_CONTAINER}`
    echo $'\nMongo ip is: '${MONGOIP}
    #import provisioned data to mongo
    sleep 5
    echo $'\n3- Importing core provisioned data ...'
    node index data import provision ${MONGOIP} DOCKER
    echo $'\n4- Importing URAC data...'
    node index data import urac ${MONGOIP}
    echo $'\n--------------------------'
}

function start(){
    echo $'\n5- Starting SERVICES ...'
    ###################################
    #URAC container
    ###################################
    createContainer "urac"
    ###################################
    #DASHBOARD container
    ###################################
    createContainer "dashboard"
    ###################################
    #CONTROLLER container
    ###################################
    sleep 5
    createContainer "controller"
    echo $'\n--------------------------'

    ###################################
    #NGINX container
    ###################################
    sleep 5
    local CONTROLLERIP=`docker inspect --format '{{ .NetworkSettings.IPAddress }}' controller`
    echo $'\n6- Starting NGINX Container "nginx" ... '
    docker run -d -p 80:80 -e "SOAJS_NX_CONTROLLER_IP_1=${CONTROLLERIP}" -e "SOAJS_NX_CONTROLLER_NB=1" -e "SOAJS_NX_API_DOMAIN=dashboard-api.${MASTER_DOMAIN}" -e "SOAJS_NX_SITE_DOMAIN=dashboard.${MASTER_DOMAIN}" -v ${LOC}soajs/open_source/dashboard:/opt/soajs/dashboard/ --name ${NGINX_CONTAINER} ${IMAGE_PREFIX}/nginx bash -c '/opt/soajs/FILES/scripts/runNginx.sh'
    echo $'\n--------------------------'

    ###################################
    echo $'\n7- Containers created and deployed:'
    docker ps
    echo $'\n--------------------------'

    ###################################
    #get mongo container IP address
    NGINXIP=`docker inspect --format '{{ .NetworkSettings.IPAddress }}' ${NGINX_CONTAINER}`
    echo $'\n\n Add the following to your /etc/hosts file:'
    echo $'\t '${NGINXIP}' dashboard-api.'${MASTER_DOMAIN}
    echo $'\t '${NGINXIP}' dashboard.'${MASTER_DOMAIN}
    echo $'\n Containers started, please login to the dashboard @ http://dashboard.'${MASTER_DOMAIN}
}

function buildFolder(){
    local SRC=${1}
    echo $'\nSRC dir is: '${SRC}
    rm -Rf ${WRK_DIR}'open_source'
    rm -Rf ${WRK_DIR}'FILES'
    mkdir -p ${WRK_DIR}'open_source/services'
    mkdir -p ${WRK_DIR}'uploads'

    pushd ${WRK_DIR}

    cp -R ${SRC}'soajs.dashboard/ui' ${WRK_DIR}'/open_source/dashboard'
    cp -R ${SRC}'soajs.controller' ${WRK_DIR}'/open_source/services/controller'
    cp -R ${SRC}'soajs.dashboard' ${WRK_DIR}'/open_source/services/dashboard'
    cp -R ${SRC}'soajs.gcs' ${WRK_DIR}'/open_source/services/gcs'
    rm -Rf ${WRK_DIR}'/open_source/services/dashboard/ui'
    cp -R ${SRC}'soajs.urac' ${WRK_DIR}'/open_source/services/urac'

    popd

    start
}
function uracSuccess(){
    if [ ${DEPLOY_FROM} == "NPM" ]; then
        npm install soajs.oauth
        rm -Rf ./soajs.oauth/node_modules/bcrypt
        npm install soajs.gcs
        npm install soajs.examples
    elif [ ${DEPLOY_FROM} == "GIT" ]; then
        git clone git@github.com:soajs/soajs.oauth.git --branch ${GIT_BRANCH}
        git clone git@github.com:soajs/soajs.gcs.git --branch ${GIT_BRANCH}
        git clone git@github.com:soajs/soajs.examples.git --branch ${GIT_BRANCH}
    else
        exit -1
    fi
    popd
    buildFolder ${SRC_DIR}
}
function uracFailure(){
    echo $'\n ... unable to install urac '${DEPLOY_FROM}' package. exiting!'
    exit -1
}
function dashSuccess(){
    if [ ${DEPLOY_FROM} == "NPM" ]; then
        npm install soajs.urac
        rm -Rf ./soajs.urac/node_modules/bcrypt
    elif [ ${DEPLOY_FROM} == "GIT" ]; then
        git clone git@github.com:soajs/soajs.urac.git --branch ${GIT_BRANCH}
    else
        exit -1
    fi
    b=$!
    wait $b && uracSuccess || uracFailure
}

function dashFailure(){
    echo $'\n ... unable to install dashboard '${DEPLOY_FROM}' package. exiting!'
    exit -1
}
function controllerSuccess(){
    if [ ${DEPLOY_FROM} == "NPM" ]; then
        npm install soajs.dashboard
        rm -Rf ./soajs.dashboard/node_modules/bcrypt
    elif [ ${DEPLOY_FROM} == "GIT" ]; then
        git clone git@github.com:soajs/soajs.dashboard.git --branch ${GIT_BRANCH}
    else
        exit -1
    fi
    b=$!
    wait $b && dashSuccess || dashFailure
}
function controllerFailure(){
    echo $'\n ... unable to install controller '${DEPLOY_FROM}' package. exiting!'
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
    echo $'\n ... unable to install soajs '${DEPLOY_FROM}' package. exiting!'
    exit -1
}

function exec(){
    if [ ${DEPLOY_FROM} == "NPM" ]; then
        rm -Rf ${SRC_DIR}
        mkdir -p ${SRC_DIR}
        pushd ${SRC_DIR}
        export NODE_ENV=production
        npm install soajs
        b=$!
        wait $b && soajsSuccess || soajsFailure
    elif [ ${DEPLOY_FROM} == "GIT" ]; then
        rm -Rf ${SRC_DIR}
        mkdir -p ${SRC_DIR}
        pushd ${SRC_DIR}
        git clone git@github.com:soajs/soajs.git --branch ${GIT_BRANCH}
        b=$!
        wait $b && soajsSuccess || soajsFailure
    elif [ ${DEPLOY_FROM} == "LOCAL" ]; then
        buildFolder ${LOC_LOCAL_SRC}
    else
        echo $'\nYou are trying to deploy from ['${LOCAL}']!'
        echo $'\n ... Deploy from must be one of the following [ NPM || GIT || LOCAL ]'
        exit -1
    fi
}

init
importData
exec

