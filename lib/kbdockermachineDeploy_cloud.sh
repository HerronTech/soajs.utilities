#!/bin/bash
#
# Requirement: docker-machine 0.6.0+
#
# https://github.com/docker/machine/releases


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

function createContainer(){
    local WHAT=${1}
    local ENV='-e NODE_ENV=production -e SOAJS_ENV=dashboard -e SOAJS_PROFILE=/opt/soajs/FILES/profiles/single.js -e SOAJS_SRV_AUTOREGISTERHOST=true'
    local VLM='-v '${LOC}'soajs/FILES:/opt/soajs/FILES -v '${LOC}'soajs/open_source/services/'${WHAT}':/opt/soajs/node_modules/'${WHAT}''

    echo $'- Starting Controller Container '${WHAT}' ...'

    if [ ${WHAT} == "dashboard" ]; then
        local EXTRA='-e SOAJS_PROFILE_LOC=/opt/soajs/FILES/profiles/ -e SOAJS_ENV_WORKDIR='${LOC}' -v '${LOC}'soajs:'${LOC}'soajs'
#        docker run -d --link ${DATA_CONTAINER}:dataProxy01 ${ENV} ${VLM} ${EXTRA} -i -t --name ${WHAT} ${IMAGE_PREFIX}/soajs bash -c 'cd /opt/soajs/node_modules/'${WHAT}'/; npm install; /opt/soajs/FILES/scripts/runService.sh /opt/soajs/node_modules/'${WHAT}/'index.js'
        docker run -d ${ENV} ${VLM} ${EXTRA} -i -t --name ${WHAT} --net=soajsnet ${IMAGE_PREFIX}/soajs bash -c 'cd /opt/soajs/node_modules/'${WHAT}'/; npm install; /opt/soajs/FILES/scripts/runService.sh /opt/soajs/node_modules/'${WHAT}/'index.js'
    else
#        docker run -d --link ${DATA_CONTAINER}:dataProxy01 ${ENV} ${VLM} -i -t --name ${WHAT} ${IMAGE_PREFIX}/soajs bash -c 'cd /opt/soajs/node_modules/'${WHAT}'/; npm install; /opt/soajs/FILES/scripts/runService.sh /opt/soajs/node_modules/'${WHAT}'/index.js'
        docker run -d ${ENV} ${VLM} -i -t --name ${WHAT} --net=soajsnet ${IMAGE_PREFIX}/soajs bash -c 'cd /opt/soajs/node_modules/'${WHAT}'/; npm install; /opt/soajs/FILES/scripts/runService.sh /opt/soajs/node_modules/'${WHAT}'/index.js'
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
function dockerPrerequisites(){
    DOCKERMACHINE=$(program_is_installed docker-machine)
    if [ ${DOCKERMACHINE} == 0 ]; then
        echo $'\n ... Unable to find docker-machine on your machine. PLease install docker machine!'
        exit -1
    fi
    DOCKER=$(program_is_installed docker)
    if [ ${DOCKER} == 0 ]; then
        echo $'\n ... Unable to find docker on your machine. PLease install docker!'
        exit -1
    fi
}
function createDockerMachine(){
    local machineName=${1}
    dockerPrerequisites

    if [ ${machineName} ]; then
        echo $'\n about to create a docker machine with the following name: '${machineName}

        local machineExist=`docker-machine inspect --format '{{ .Name }}' ${machineName}`
        if [ "${machineExist}" == "${machineName}" ]; then
            echo $'\n docker machine: '${machineName}' already exist, trying to force restart'
            docker-machine stop ${machineName}
            docker-machine start ${machineName}
            docker-machine regenerate-certs ${machineName}
        else
            docker-machine create -d rackspace \
             --swarm \--swarm-discovery="consul://$(docker-machine ip v-keystore):8500" \
             --engine-opt="cluster-store=consul://$(docker-machine ip v-keystore):8500" \
             --engine-opt="cluster-advertise=eth1:2376" \
             --rackspace-api-key $rkapikey \
             --rackspace-username $rkusername \
             --rackspace-region IAD ${machineName}
        fi
    else
        echo $'\n ... to create a docker machine, a name must be provided!'
        exit -1
    fi
}
function cleanContainers(){
    local machineName=${1}

    eval "$(docker-machine env ${machineName})"
    docker ps -a
    echo $'\n1- Cleaning previous docker containers ...'
#    docker stop $(docker ps -a -q)
    sleep 1
#    docker rm $(docker ps -a -q)
    echo $'\n--------------------------'
}
function pullNeededImages(){
    local machineName=${1}

    eval "$(docker-machine env ${machineName})"
    docker pull soajsorg/soajs
    docker pull soajsorg/nginx
}

#### DASH CLOUD
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
    echo $'\n6- Starting NGINX Container "nginx" ... '
#    docker run -d --link controller:controllerProxy01 -p 80:80 -e "SOAJS_NX_NBCONTROLLER=1" -e "SOAJS_NX_APIDOMAIN=dashboard-api.${MASTER_DOMAIN}" -e "SOAJS_NX_DASHDOMAIN=dashboard.${MASTER_DOMAIN}" -e "SOAJS_NX_APIPORT=80" -v ${LOC}soajs/open_source/dashboard:/opt/soajs/dashboard/ -v ${LOC}soajs/FILES:/opt/soajs/FILES --name ${NGINX_CONTAINER} ${IMAGE_PREFIX}/nginx bash -c '/opt/soajs/FILES/scripts/runNginx.sh'
    docker run -d -p 80:80 -e "SOAJS_NX_NBCONTROLLER=1" -e "SOAJS_NX_APIDOMAIN=dashboard-api.${MASTER_DOMAIN}" -e "SOAJS_NX_DASHDOMAIN=dashboard.${MASTER_DOMAIN}" -e "SOAJS_NX_APIPORT=80" -v ${LOC}soajs/open_source/dashboard:/opt/soajs/dashboard/ -v ${LOC}soajs/FILES:/opt/soajs/FILES --name ${NGINX_CONTAINER} --net=soajsnet ${IMAGE_PREFIX}/nginx bash -c '/opt/soajs/FILES/scripts/runNginx.sh'
    echo $'\n--------------------------'

    ###################################
    echo $'\n7- Containers created and deployed:'
    docker ps
    echo $'\n--------------------------'

    ###################################
    echo $'\n\n Add the following to your /etc/hosts file:'
    echo $'\t '${MACHINEIP}' dashboard-api.'${MASTER_DOMAIN}
    echo $'\t '${MACHINEIP}' dashboard.'${MASTER_DOMAIN}
    echo $'\n Containers started, please login to the dashboard @ http://dashboard.'${MASTER_DOMAIN}
}
function buildFolder(){
    local SRC=${1}
    echo $'\nSRC dir is: '${SRC}
    rm -Rf ${WRK_DIR}'open_source'
    rm -Rf ${WRK_DIR}'FILES'
    mkdir -p ${WRK_DIR}'open_source/services'
    mkdir -p ${WRK_DIR}'uploads'
    mkdir -p ${WRK_DIR}'certs'
    cp $HOME'/.docker/machine/certs/ca.pem' ${WRK_DIR}'certs/'
    cp $HOME'/.docker/machine/certs/key.pem' ${WRK_DIR}'certs/'
    cp $HOME'/.docker/machine/certs/cert.pem' ${WRK_DIR}'certs/'

    cp -R './FILES' ${WRK_DIR}'FILES'
    mv ${WRK_DIR}'FILES/profiles/single.js' ${WRK_DIR}'FILES/profiles/single-manual.js'
    mv ${WRK_DIR}'FILES/profiles/single-docker.js' ${WRK_DIR}'FILES/profiles/single-docker.js'
    sed -e "s/__SOAJS_DASH_IP__/${MACHINEIP}/" ${WRK_DIR}'FILES/profiles/single-docker.js' > ${WRK_DIR}'FILES/profiles/single.js'

    pushd ${WRK_DIR}

    cp -R ${SRC}'soajs.dashboard/ui' ${WRK_DIR}'open_source/dashboard'
    cp -R ${SRC}'soajs.controller' ${WRK_DIR}'open_source/services/controller'
    cp -R ${SRC}'soajs.dashboard' ${WRK_DIR}'open_source/services/dashboard'
    cp -R ${SRC}'soajs.gcs' ${WRK_DIR}'open_source/services/gcs'
    rm -Rf ${WRK_DIR}'open_source/services/dashboard/ui'
    cp -R ${SRC}'soajs.urac' ${WRK_DIR}'open_source/services/urac'
    cp -R ${SRC}'soajs.oauth' ${WRK_DIR}'open_source/services/oauth'
    cp -R ${SRC}'soajs.examples/example01' ${WRK_DIR}'open_source/services/example01'
    cp -R ${SRC}'soajs.examples/example02' ${WRK_DIR}'open_source/services/example02'
    cp -R ${SRC}'soajs.examples/example03' ${WRK_DIR}'open_source/services/example03'
    cp -R ${SRC}'soajs.examples/example04' ${WRK_DIR}'open_source/services/example04'

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
    local machineName=${1}
    eval "$(docker-machine env ${machineName})"
    MACHINEIP=`docker-machine ip ${machineName}`

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
        echo $'\nYou are trying to deploy from ['${DEPLOY_FROM}']!'
        echo $'\n ... Deploy from must be one of the following [ NPM || GIT || LOCAL ]'
        exit -1
    fi
}
function buildDashMongo(){
    local machineName=${1}
    local machineDevName=${2}

    local DEVMACHINEIP=`docker-machine ip ${machineDevName}`
    local MONGOIP=`docker-machine ip ${machineName}`
    docker-machine ssh ${machineName} "sudo mkdir -p /data; sudo chgrp staff -R /data; sudo chmod 775 -R /data; exit"
    SOAJS_DATA_VLM='-v /data:/data -v /data/db:/data/db'

    echo $'\n2- Starging Mongo Container "soajsData" ...'
#    docker run -d -p 27017:27017 ${SOAJS_DATA_VLM} --name ${DATA_CONTAINER} mongo mongod --smallfiles
    docker run -d -p 27017:27017 ${SOAJS_DATA_VLM} --name ${DATA_CONTAINER} --net=soajsnet mongo mongod --smallfiles
    echo $'\n--------------------------'
    echo $'\nMongo ip is: '${MONGOIP}

    #import provisioned data to mongo
    sleep 5
    echo $'\n3- Importing core provisioned data ...'
    node index data import provision ${MONGOIP} DOCKER ${DEVMACHINEIP}
    echo $'\n4- Importing URAC data...'
    node index data import urac ${MONGOIP}
    echo $'\n--------------------------'
}
function setupDashEnv(){
    local machineName=${1}
    local machineDevName=${2}
    echo $'\n1- Setting up cloud for: '${machineName}

    cleanContainers ${machineName}
    buildDashMongo ${machineName} ${machineDevName}
    exec ${machineName}

    echo $'\n .....Cloud setup DONE'
}
#### DASH CLOUD END ###

#### DEV CLOUD
function setupDevEnv(){
    local machineName=${1}
    echo $'\n Setting up cloud for: '${machineName}

    local DEVMACHINEIP=`docker-machine ip ${machineName}`

    echo $'\n\n Add the following to your /etc/hosts file:'
    echo $'\t '${DEVMACHINEIP}' api.mydomain.com'

    echo $'\n .....Cloud setup DONE'

}
#### DEV CLOUD END ###
function setupComm(){
    docker-machine create --driver rackspace --rackspace-api-key $rkapikey --rackspace-username $rkusername --rackspace-region IAD v-keystore
    docker $(docker-machine config v-keystore) run -d -p "8500:8500" -h "consul" progrium/consul -server -bootstrap
    echo $'\n .....Keystore setup DONE'
}
function setupSwarmMaster(){
    docker-machine create \
     -d rackspace \
     --swarm --swarm-master \
     --swarm-discovery="consul://$(docker-machine ip v-keystore):8500" \
     --engine-opt="cluster-store=consul://$(docker-machine ip v-keystore):8500" \
     --engine-opt="cluster-advertise=eth1:2376" \
     --rackspace-api-key $rkapikey \
     --rackspace-username $rkusername \
     --rackspace-region IAD soajs-swarm-master
    echo $'\n .....swarm-master setup DONE'
}
function setupContainerNetwork(){
    eval $(docker-machine env --swarm soajs-swarm-master)
    docker network create --driver overlay soajsnet
    echo $'\n .....Container Network setup DONE'
}
function setupcloud(){
    while [ "$answerinput" != "y" ]
     do
      clear
      echo -n "Please type in your Rackspace username, followed by [ENTER]: "
      read rkusername
      echo ""
      echo -n "Please type in your Rackspace API key, followed by [ENTER]: "
      read rkapikey
      echo ""
      echo "Username: $rkusername"
      echo "API key: $rkapikey"
      echo ""
      echo -n "Are the above correct? y or n: "
      read answerinput
    done
}

setupcloud
setupComm
setupSwarmMaster
setupContainerNetwork

createDockerMachine "soajs-dash"
createDockerMachine "soajs-dev"

pullNeededImages "soajs-dev"
pullNeededImages "soajs-dash"

setupDashEnv "soajs-dash" "soajs-dev"
setupDevEnv "soajs-dev"


