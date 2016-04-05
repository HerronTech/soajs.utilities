#!/bin/bash
#
# Requirement: docker-machine 0.6.0+
#
# https://github.com/docker/machine/releases

GIT_BRANCH="develop"
DATA_CONTAINER='soajsData'
IMAGE_PREFIX='soajsorg'
NGINX_CONTAINER='nginx'
MASTER_DOMAIN='soajs.org'
KEYSTORE_MACHINE="soajs-v-keystore"
IP_SUBNET="10.0.0.0"
SET_SOAJS_SRVIP="off"
INSTRUCT_MSG=$'\n\n-------------------------------------------------------------------------------------------'

function createContainer(){
    local REPO=${1}
    local BRANCH=${2}
    local OWNER="soajs"
    local ENV='-e NODE_ENV=production -e SOAJS_ENV=dashboard -e SOAJS_PROFILE=/opt/soajs/FILES/profiles/profile.js -e SOAJS_SRV_AUTOREGISTERHOST=true -e SOAJS_MONGO_NB=1 -e SOAJS_MONGO_IP_1='${MACHINEIP}' -e SOAJS_GIT_OWNER='${OWNER}' -e SOAJS_GIT_REPO='${REPO}' -e SOAJS_GIT_BRANCH='${BRANCH}''

    echo $'- Starting Controller Container '${REPO}' ...'
    docker run -d ${ENV} -i -t --name ${REPO} --net=soajsnet ${IMAGE_PREFIX}/soajs bash -c '/opt/soajs/FILES/scripts/runService.sh /index.js '${SET_SOAJS_SRVIP}' '${IP_SUBNET}
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
            docker-machine regenerate-certs -f ${machineName}
        else
            docker-machine create -d virtualbox \
             --swarm \--swarm-discovery="consul://$(docker-machine ip ${KEYSTORE_MACHINE}):8500" \
             --engine-opt="cluster-store=consul://$(docker-machine ip ${KEYSTORE_MACHINE}):8500" \
             --engine-opt="cluster-advertise=eth1:2376" \
             ${machineName}
        fi
    else
        echo $'\n ... to create a docker machine, a name must be provided!'
        exit -1
    fi
}
function cleanContainers(){
    local machineName=${1}
    local type=${2}

    eval "$(docker-machine env ${machineName})"
    docker ps -a
    echo $'\n Cleaning previous docker containers ...'
    if [ "${type}" == "all" ]; then
        docker stop $(docker ps -a -q)
        sleep 1
        docker rm $(docker ps -a -q)
    else
        docker stop $(docker ps -a | grep -v CONT | grep -v swarm | awk {'print $1'})
        sleep 1
        docker rm $(docker ps -a | grep -v CONT | grep -v swarm | awk {'print $1'})
    fi
    echo $'\n--------------------------'
}
function pullNeededImages(){
    local machineName=${1}

    eval "$(docker-machine env ${machineName})"
    #docker pull soajsorg/soajs
    #docker pull soajsorg/nginx
}

#### DASH CLOUD
function start(){
    local machineName=${1}
    eval "$(docker-machine env ${machineName})"
    MACHINEIP=`docker-machine ip ${machineName}`

    echo $'\n Starting SERVICES ...'
    ###################################
    #URAC container
    ###################################
    createContainer "soajs.urac" "develop"
    ###################################
    #DASHBOARD container
    ###################################
    createContainer "soajs.dashboard" "feature/deployer"
    ###################################
    #PROXY container
    ###################################
    createContainer "soajs.prx" "develop"
    ###################################
    #CONTROLLER container
    ###################################
    sleep 5
    createContainer "soajs.controller" "master"
    echo $'\n--------------------------'

    ###################################
    #NGINX container
    ###################################
    sleep 5

    local BRANCH="feature/deployer"
    local CONTROLLERIP=`docker inspect --format '{{ .NetworkSettings.Networks.soajsnet.IPAddress }}' soajs.controller`
    echo $'\n Starting NGINX Container "nginx" ... '
    docker run -d -p 80:80 -e "SOAJS_NX_CONTROLLER_IP_1=${CONTROLLERIP}" -e "SOAJS_NX_CONTROLLER_NB=1" -e "SOAJS_NX_API_DOMAIN=dashboard-api.${MASTER_DOMAIN}" -e "SOAJS_NX_SITE_DOMAIN=dashboard.${MASTER_DOMAIN}" -e "SOAJS_GIT_DASHBOARD_BRANCH="${BRANCH} --name ${NGINX_CONTAINER} --net=soajsnet ${IMAGE_PREFIX}/nginx bash -c '/opt/soajs/FILES/scripts/runNginx.sh'
    echo $'\n--------------------------'

    ###################################
    echo $'\n Containers created and deployed:'
    docker ps
    echo $'\n--------------------------'

    ###################################
    INSTRUCT_MSG=${INSTRUCT_MSG}$'\n Containers started, please login to the dashboard @ http://dashboard.'${MASTER_DOMAIN}
    INSTRUCT_MSG=${INSTRUCT_MSG}$'\n Add the following to your /etc/hosts file:'
    INSTRUCT_MSG=${INSTRUCT_MSG}$'\n\t '${MACHINEIP}' dashboard-api.'${MASTER_DOMAIN}
    INSTRUCT_MSG=${INSTRUCT_MSG}$'\n\t '${MACHINEIP}' dashboard.'${MASTER_DOMAIN}
}

function buildDashMongo(){
    local machineName=${1}
    local machineDevName=${2}

    local DEVMACHINEIP=`docker-machine ip ${machineDevName}`
    local MONGOIP=`docker-machine ip ${machineName}`
    docker-machine ssh ${machineName} "sudo mkdir -p /data; sudo chgrp staff -R /data; sudo chmod 775 -R /data; exit"
    local SOAJS_DATA_VLM='-v /data:/data -v /data/db:/data/db'

    echo $'\n Starging Mongo Container "soajsData" ...'
    docker run -d -p 27017:27017 ${SOAJS_DATA_VLM} --name ${DATA_CONTAINER} --net=soajsnet mongo mongod --smallfiles
    echo $'\n--------------------------'
    echo $'\nMongo ip is: '${MONGOIP}

    #import provisioned data to mongo
    sleep 5
    echo $'\n Importing core provisioned data ...'
    node index data import provision ${MONGOIP} DOCKERMACHINE ${DEVMACHINEIP}
    echo $'\n4- Importing URAC data...'
    node index data import urac ${MONGOIP}
    echo $'\n--------------------------'
}
function setupDashEnv(){
    local machineName=${1}
    local machineDevName=${2}
    echo $'\n1- Setting up cloud for: '${machineName}

    cleanContainers ${machineName} "swarm"
    buildDashMongo ${machineName} ${machineDevName}

    while true; do
        read -p "Do you wish to build the containers?" yn
        case $yn in
            [Yy]* ) start ${machineName}; echo $'\n ..... DASH Cloud setup DONE'; break;;
            [Nn]* ) exit;;
            * ) echo "Please answer yes or no.";;
        esac
    done
}
#### DASH CLOUD END ###

#### DEV CLOUD
function buildDevMongo(){
    local machineName=${1}
    local MONGOIP=`docker-machine ip ${machineName}`
    docker-machine ssh ${machineName} "sudo mkdir -p /data; sudo chgrp staff -R /data; sudo chmod 775 -R /data; exit"
    local SOAJS_DATA_VLM='-v /data:/data -v /data/db:/data/db'

    echo $'\n Starging Mongo Container "soajsData" '${machineName}' '${MONGOIP}' ...'
    docker run -d -p 27017:27017 ${SOAJS_DATA_VLM} --name ${DATA_CONTAINER}DEV --net=soajsnet --env="constraint:node==${machineName}" mongo mongod --smallfiles
    echo $'\n--------------------------'
    echo $'\nMongo ip is: '${MONGOIP}
}
function setupDevEnv(){
    local machineName=${1}
    echo $'\n Setting up cloud for: '${machineName}

    local DEVMACHINEIP=`docker-machine ip ${machineName}`

    cleanContainers ${machineName} "swarm"
    buildDevMongo ${machineName}

    INSTRUCT_MSG=${INSTRUCT_MSG}$'\n\t '${DEVMACHINEIP}' api.mydomain.com'

    echo $'\n ..... DEV Cloud setup DONE'

}
#### DEV CLOUD END ###

function setupComm(){
    dockerPrerequisites

    echo $'\n about to create a docker machine with the following name: '${KEYSTORE_MACHINE}

    local machineExist=`docker-machine inspect --format '{{ .Name }}' ${KEYSTORE_MACHINE}`
    if [ "${machineExist}" == "${KEYSTORE_MACHINE}" ]; then
        echo $'\n docker machine: '${KEYSTORE_MACHINE}' already exist, trying to force restart'
        docker-machine stop ${KEYSTORE_MACHINE}
        docker-machine start ${KEYSTORE_MACHINE}
        docker-machine regenerate-certs -f ${KEYSTORE_MACHINE}
    else
        docker-machine create -d virtualbox ${KEYSTORE_MACHINE}
    fi

    cleanContainers ${KEYSTORE_MACHINE}
    docker $(docker-machine config ${KEYSTORE_MACHINE}) run -d -p "8500:8500" -h "consul" progrium/consul -server -bootstrap
    echo $'\n .....'${KEYSTORE_MACHINE}' setup DONE'
}
function setupSwarmMaster(){
    local machineName=${1}
    dockerPrerequisites

    echo $'\n about to create a docker machine with the following name: '${machineName}

    local machineExist=`docker-machine inspect --format '{{ .Name }}' ${machineName}`
    if [ "${machineExist}" == "${machineName}" ]; then
        echo $'\n docker machine: '${machineName}' already exist, trying to force restart'
        docker-machine stop ${machineName}
        docker-machine start ${machineName}
        docker-machine regenerate-certs -f ${machineName}
    else
        docker-machine create \
         -d virtualbox \
         --swarm --swarm-master \
         --swarm-discovery="consul://$(docker-machine ip ${KEYSTORE_MACHINE}):8500" \
         --engine-opt="cluster-store=consul://$(docker-machine ip ${KEYSTORE_MACHINE}):8500" \
         --engine-opt="cluster-advertise=eth1:2376" \
         ${machineName}
    fi

    echo $'\n .....'${machineName}' setup DONE'

    eval "$(docker-machine env --swarm ${machineName})"
    docker network create --driver overlay soajsnet
    echo $'\n .....Container Network setup DONE'
}

function choices(){
    while [ "$answerinput" != "y" ]
     do
      clear
      echo "1. Install"
      echo "2. Rebuild all containers?"
      echo "3. Rebuild Dash only?"
      echo "4. Rebuild Dev only?"
      echo ""
      echo -n "What would you like to do? "
      read choice
      echo ""
      echo ""
      echo "Choice: $choice"
      echo ""
      echo -n "Are you sure? y or n "
      read answerinput
    done
    DEPLOY_FROM=$choicepull
}
function gochoice(){

    if [ ${choice} == "1" ]; then
        setupComm
        setupSwarmMaster "soajs-swarm-master"
        createDockerMachine "soajs-dash"
        createDockerMachine "soajs-dev"
        pullNeededImages "soajs-dev"
        pullNeededImages "soajs-dash"
        setupDashEnv "soajs-dash" "soajs-dev"
        setupDevEnv "soajs-dev"
    elif [ ${choice} == "2" ]; then
#        eval $(docker-machine env soajs-dash)
#        pullNeededImages "soajs-dev"
#        pullNeededImages "soajs-dash"
        setupDashEnv "soajs-dash" "soajs-dev"
        setupDevEnv "soajs-dev"
    elif [ ${choice} == "3" ]; then
        setupDashEnv "soajs-dash" "soajs-dev"
    elif [ ${choice} == "4" ]; then
        setupDevEnv "soajs-dev"        
    else
        clear
        echo "Nothing executed."
        echo ""
    fi

}

choices
gochoice

echo "$INSTRUCT_MSG"
