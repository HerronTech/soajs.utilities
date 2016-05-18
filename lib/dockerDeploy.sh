#!/bin/bash

[ ${SOAJS_DEPLOY_DIR} ] && LOC=${SOAJS_DEPLOY_DIR} || LOC='/Users/'

GIT_BRANCH="master"
DATA_CONTAINER='soajsData'
IMAGE_PREFIX='soajsorg'
NGINX_CONTAINER='nginx'
IP_SUBNET="172.17.0.0"
SET_SOAJS_SRVIP="off"

# Supported export variables
if [ -z $MASTER_DOMAIN ]; then MASTER_DOMAIN='soajs.org'; fi
if [ -z $SOAJS_DNS ]; then SOAJS_DNS="8.8.8.8"; fi
if [ -z $SOAJS_NO_NGINX ]; then SOAJS_NO_NGINX=false; fi
#

function createContainer(){
    local REPO=${1}
    local BRANCH=${2}
    local OWNER="soajs"
    local ENV='--dns='${SOAJS_DNS}' -e NODE_ENV=production -e SOAJS_ENV=dashboard -e SOAJS_PROFILE=/opt/soajs/FILES/profiles/profile.js -e SOAJS_SRV_AUTOREGISTERHOST=true -e SOAJS_MONGO_NB=1 -e SOAJS_MONGO_IP_1='${MONGOIP}' -e SOAJS_GIT_OWNER='${OWNER}' -e SOAJS_GIT_REPO='${REPO}' -e SOAJS_GIT_BRANCH='${BRANCH}''

    echo $'- Starting Controller Container '${REPO}' ...'
    if [ ${REPO} == "soajs.urac" ]; then
        docker run -d ${ENV} -i -t --name ${REPO} ${IMAGE_PREFIX}/soajs bash -c "/etc/init.d/postfix start; cd /opt/soajs/FILES/deployer/; ./soajsDeployer.sh -T service -X deploy -P ${SET_SOAJS_SRVIP} -S ${IP_SUBNET}"
    elif [ ${REPO} == "soajs.dashboard" ] && [ SOAJS_NO_NGINX=true ]; then
        #no need for these env anymore, waiting to remove dependency from dashboard
        local EXTRA='-v /var/run/docker.sock:/var/run/docker.sock'
        docker run -d ${ENV} ${EXTRA} -e ${SOAJS_NO_NGINX} -i -t --name ${REPO} ${IMAGE_PREFIX}/soajs bash -c "cd /opt/soajs/FILES/deployer/; ./soajsDeployer.sh -T service -X deploy -P ${SET_SOAJS_SRVIP} -S ${IP_SUBNET}"
    elif [ ${REPO} == "soajs.dashboard" ] && [ SOAJS_NO_NGINX=false ]; then
        #no need for these env anymore, waiting to remove dependency from dashboard
        local EXTRA='-v /var/run/docker.sock:/var/run/docker.sock'
        docker run -d ${ENV} ${EXTRA} -i -t --name ${REPO} ${IMAGE_PREFIX}/soajs bash -c "cd /opt/soajs/FILES/deployer/; ./soajsDeployer.sh -T service -X deploy -P ${SET_SOAJS_SRVIP} -S ${IP_SUBNET}"
    else
        docker run -d ${ENV} ${EXTRA} -i -t --name ${REPO} ${IMAGE_PREFIX}/soajs bash -c "cd /opt/soajs/FILES/deployer/; ./soajsDeployer.sh -T service -X deploy -P ${SET_SOAJS_SRVIP} -S ${IP_SUBNET}"
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
    SOAJS_DATA_VLM_DEV='-v '${LOC}'soajs/dev/data:/data -v '${LOC}'soajs/dev/data/db:/data/db'
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

    docker run -d -e "SOAJS_NX_CONTROLLER_IP_1=${CONTROLLERIP}" -e "SOAJS_NX_CONTROLLER_NB=1" -e "SOAJS_NX_API_DOMAIN=dashboard-api.${MASTER_DOMAIN}" -e "SOAJS_NX_SITE_DOMAIN=dashboard.${MASTER_DOMAIN}" -e "SOAJS_GIT_DASHBOARD_BRANCH="${BRANCH} --name ${NGINX_CONTAINER} ${IMAGE_PREFIX}/nginx bash -c "cd /opt/soajs/FILES/deployer/; ./soajsDeployer.sh -T nginx -X deploy"

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
importData
start
