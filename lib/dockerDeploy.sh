#!/bin/bash

[ ${SOAJS_DEPLOY_DIR} ] && LOC=${SOAJS_DEPLOY_DIR} || LOC='/Users/'

GIT_BRANCH="master"
DATA_CONTAINER='soajsData'
IMAGE_PREFIX='soajsorg'
NGINX_CONTAINER='nginx'

MASTER_DOMAIN='soajs.org'
if [ -n "${SOAJS_NX_MASTER_DOMAIN}" ]; then
    MASTER_DOMAIN=${SOAJS_NX_MASTER_DOMAIN};
fi

function createContainer(){
    local REPO=${1}
    local BRANCH=${2}
    local OWNER="soajs"

    local ENV='-e NODE_ENV=production -e SOAJS_ENV=dashboard -e SOAJS_PROFILE=/opt/soajs/FILES/profiles/profile.js -e SOAJS_SRV_AUTOREGISTERHOST=true'

    ENV=${ENV}' -e SOAJS_MONGO_NB=1'
    if [ -n "${SOAJS_MONGO_OBJECTROCKET}" ] && [ "${SOAJS_MONGO_OBJECTROCKET}" == "true" ]; then
        if [ -n "${SOAJS_MONGO_OBJECTROCKET_URL}" ]; then
            ENV=${ENV}' -e SOAJS_MONGO_IP_1='${SOAJS_MONGO_OBJECTROCKET_URL}
        fi
        if [ -n "${SOAJS_MONGO_OBJECTROCKET_PORT}" ]; then
            ENV=${ENV}' -e SOAJS_MONGO_PORT_1='${SOAJS_MONGO_OBJECTROCKET_PORT}
        fi
    else
        ENV=${ENV}' -e SOAJS_MONGO_IP_1='${MONGOIP}
    fi

    ENV=${ENV}' -e SOAJS_GIT_OWNER='${OWNER}' -e SOAJS_GIT_REPO='${REPO}' -e SOAJS_GIT_BRANCH='${BRANCH}

    if [ -n "${SOAJS_MONGO_USERNAME}" ]; then
        ENV=${ENV}' -e SOAJS_MONGO_USERNAME='${SOAJS_MONGO_USERNAME}
    fi
    if [ -n "${SOAJS_MONGO_PASSWORD}" ]; then
        ENV=${ENV}' -e SOAJS_MONGO_PASSWORD='${SOAJS_MONGO_PASSWORD}
    fi
    if [ -n "${SOAJS_MONGO_SSL}" ]; then
        ENV=${ENV}' -e SOAJS_MONGO_SSL='${SOAJS_MONGO_SSL}
    fi

    echo $'- Starting Controller Container '${REPO}' ...'
    if [ ${REPO} == "soajs.urac" ]; then
        docker run -d ${ENV} -i -t --name ${REPO} ${IMAGE_PREFIX}/soajs bash -c "/etc/init.d/postfix start; cd /opt/soajs/FILES/deployer/; ./soajsDeployer.sh -T service -X deploy -L"
    elif [ ${REPO} == "soajs.dashboard" ]; then
        local EXTRA='-v /var/run/docker.sock:/var/run/docker.sock'
        docker run -d ${ENV} ${EXTRA} -i -t --name ${REPO} ${IMAGE_PREFIX}/soajs bash -c "cd /opt/soajs/FILES/deployer/; ./soajsDeployer.sh -T service -X deploy -L"
    else
        docker run -d ${ENV} ${EXTRA} -i -t --name ${REPO} ${IMAGE_PREFIX}/soajs bash -c "cd /opt/soajs/FILES/deployer/; ./soajsDeployer.sh -T service -X deploy -L"
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
    SOAJS_DATA_VLM='-v '${LOC}'soajs/data:/data -v '${LOC}'soajs/data/db:/data/db'
    SOAJS_DATA_VLM_DEV='-v '${LOC}'soajs/dev/data:/data -v '${LOC}'soajs/dev/data/db:/data/db'
    echo $'\n2- Starging Mongo Container "soajsData" ...'
    docker run -d ${SOAJS_DATA_VLM} --name ${DATA_CONTAINER} mongo mongod --smallfiles
    echo $'\n--------------------------'
    #get mongo container IP address
    MONGOIP=`docker inspect --format '{{ .NetworkSettings.IPAddress }}' ${DATA_CONTAINER}`
    echo $'\nMongo ip is: '${MONGOIP}

    echo $'\n3- Starging Mongo Container "soajsDataDev" ...'
    docker run -d ${SOAJS_DATA_VLM_DEV} --name "${DATA_CONTAINER}Dev" mongo mongod --smallfiles
    echo $'\n--------------------------'
    #get mongo container IP address
    MONGOIPDEV=`docker inspect --format '{{ .NetworkSettings.IPAddress }}' ${DATA_CONTAINER}Dev`
    echo $'\nMongo Dev ip is: '${MONGOIPDEV}

    #import provisioned data to mongo
    sleep 5
    echo $'\n4- Importing core provisioned data ...'
    node index data import provision ${MONGOIP} DOCKER ${MONGOIPDEV}
    echo $'\n5- Importing URAC data...'
    node index data import urac ${MONGOIP}
    echo $'\n--------------------------'
}

function start(){
    echo $'\n6- Starting SERVICES ...'
    ###################################
    #URAC container
    ###################################
    createContainer "soajs.urac" ${GIT_BRANCH}
    ###################################
    #DASHBOARD container
    ###################################
    createContainer "soajs.dashboard" ${GIT_BRANCH}
    ###################################
    #PROXY container
    ###################################
    createContainer "soajs.prx" ${GIT_BRANCH}
    ###################################
    #CONTROLLER container
    ###################################
    sleep 5
    createContainer "soajs.controller" ${GIT_BRANCH}
    echo $'\n--------------------------'

    ###################################
    #NGINX container
    ###################################
    sleep 5
    local BRANCH=${GIT_BRANCH}
    local CONTROLLERIP=`docker inspect --format '{{ .NetworkSettings.IPAddress }}' soajs.controller`
    echo $'\n7- Starting NGINX Container "nginx" ... '

    local ENV='-e SOAJS_NX_CONTROLLER_IP_1='${CONTROLLERIP}' -e SOAJS_NX_CONTROLLER_NB=1'
    ENV=${ENV}' -e SOAJS_NX_API_DOMAIN=dashboard-api.'${MASTER_DOMAIN}' -e SOAJS_NX_SITE_DOMAIN=dashboard.'${MASTER_DOMAIN}
    ENV=${ENV}' -e SOAJS_GIT_DASHBOARD_BRANCH='${BRANCH}

    if [ -n "${SOAJS_GIT_OWNER}" ]; then
        ENV=${ENV}' -e SOAJS_GIT_OWNER='${SOAJS_GIT_OWNER}
    fi
    if [ -n "${SOAJS_GIT_REPO}" ]; then
        ENV=${ENV}' -e SOAJS_GIT_REPO='${SOAJS_GIT_REPO}
    fi
    if [ -n "${SOAJS_GIT_BRANCH}" ]; then
        ENV=${ENV}' -e SOAJS_GIT_BRANCH='${SOAJS_GIT_BRANCH}
    fi
    if [ -n "${SOAJS_GIT_TOKEN}" ]; then
        ENV=${ENV}' -e SOAJS_GIT_TOKEN='${SOAJS_GIT_TOKEN}
    fi

    local deployerExtra=""
    if [ -n "${SOAJS_NX_SSL}" ] && [ "${SOAJS_NX_SSL}" == "true"  ]; then
        deployerExtra=" -s"
    fi

    docker run -d ${ENV} --name ${NGINX_CONTAINER} ${IMAGE_PREFIX}/nginx bash -c "cd /opt/soajs/FILES/deployer/; ./soajsDeployer.sh -T nginx -X deploy"${deployerExtra}

    echo $'\n--------------------------'

    ###################################
    echo $'\n8- Containers created and deployed:'
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

init

if [ -n "${SOAJS_MONGO_OBJECTROCKET}" ] && [ "${SOAJS_MONGO_OBJECTROCKET}" == "true" ]; then
    echo $'Object Rocket is turned on skipping provisioning mongo containers'
else
    importData
fi

start
