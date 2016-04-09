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
API_DOMAIN='api.mydomain.com'

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
        echo $'\n ... Unable to find docker-machine on your machine. Please install docker machine!'
        exit -1
    fi
    DOCKER=$(program_is_installed docker)
    if [ ${DOCKER} == 0 ]; then
        echo $'\n ... Unable to find docker on your machine. Please install docker!'
        exit -1
    fi
}
function createDockerMachine(){
    local machineName=${1}
    dockerPrerequisites

    if [ ${machineName} ]; then
        echo $'\nAbout to create a docker machine with the following name: '${machineName}

        local machineExist=`docker-machine inspect --format '{{ .Name }}' ${machineName}`
        if [ "${machineExist}" == "${machineName}" ]; then
            echo $'\ndocker machine: '${machineName}' already exist, trying to force restart'
            docker-machine stop ${machineName}
            docker-machine start ${machineName}
            docker-machine regenerate-certs -f ${machineName}
        else
            docker-machine create -d rackspace \
             --swarm \--swarm-discovery="consul://$(docker-machine ip ${KEYSTORE_MACHINE}):8500" \
             --engine-opt="cluster-store=consul://$(docker-machine ip ${KEYSTORE_MACHINE}):8500" \
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
    local type=${2}

    eval "$(docker-machine env ${machineName})"
    docker ps -a
    echo $'\nCleaning previous docker containers ...'
    if [ "${type}" == "all" ]; then
        docker stop $(docker ps -a -q)
        sleep 1
        docker rm $(docker ps -a -q)
    elif [ "${type}" == "mongo" ]; then
        docker stop $(docker ps -a | grep -v CONT | grep -v swarm | grep -v mongo | awk {'print $1'})
        sleep 1
        docker rm $(docker ps -a | grep -v CONT | grep -v swarm | grep -v mongo | awk {'print $1'})
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

    echo $'\nStarting SERVICES ...'
    ###################################
    #URAC container
    ###################################
    createContainer "soajs.urac" "develop"
    ###################################
    #DASHBOARD container
    ###################################
    createContainer "soajs.dashboard" "develop"
    ###################################
    #PROXY container
    ###################################
    createContainer "soajs.prx" "develop"
    ###################################
    #CONTROLLER container
    ###################################
    sleep 5
    createContainer "soajs.controller" "develop"
    echo $'\n--------------------------'

    ###################################
    #NGINX container
    ###################################
    sleep 5

    local BRANCH="develop"
    local CONTROLLERIP=`docker inspect --format '{{ .NetworkSettings.Networks.soajsnet.IPAddress }}' soajs.controller`
    echo $'\nStarting NGINX Container "nginx" ... '
    docker run -d -p 80:80 -e "SOAJS_NX_CONTROLLER_IP_1=${CONTROLLERIP}" -e "SOAJS_NX_CONTROLLER_NB=1" -e "SOAJS_NX_API_DOMAIN=dashboard-api.${MASTER_DOMAIN}" -e "SOAJS_NX_SITE_DOMAIN=dashboard.${MASTER_DOMAIN}" -e "SOAJS_GIT_DASHBOARD_BRANCH="${BRANCH} --name ${NGINX_CONTAINER} --net=soajsnet ${IMAGE_PREFIX}/nginx bash -c '/opt/soajs/FILES/scripts/runNginx.sh'
    echo $'\n--------------------------'

    ###################################
    echo $'\nContainers created and deployed:'
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

    echo $'\nStarging Mongo Container "soajsData" ...'
    docker run -d -p 27017:27017 ${SOAJS_DATA_VLM} --name ${DATA_CONTAINER} --net=soajsnet mongo mongod --smallfiles
    echo $'\n--------------------------'
    echo $'\nMongo ip is: '${MONGOIP}

    #import provisioned data to mongo
    sleep 5
    echo $'\nImporting core provisioned data ...'
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
        read -p "Do you wish to build the containers? " yn
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

    echo $'\nStarting Mongo Container' ${DATA_CONTAINER}DEV' on '${machineName}' '${MONGOIP}' ...'
    docker run -d -p 27017:27017 ${SOAJS_DATA_VLM} --name ${DATA_CONTAINER}DEV --net=soajsnet --env="constraint:node==${machineName}" mongo mongod --smallfiles
    echo $'\n--------------------------'
    echo $'\nMongo ip is: '${MONGOIP}
}
function setupDevEnv(){
    local machineName=${1}
    echo $'\nSetting up cloud for: '${machineName}

    local DEVMACHINEIP=`docker-machine ip ${machineName}`

    cleanContainers ${machineName} "swarm"
    buildDevMongo ${machineName}

    INSTRUCT_MSG=${INSTRUCT_MSG}$'\n\t '${DEVMACHINEIP}' '${API_DOMAIN}

    echo $'\n ..... ' ${machineName} 'setup DONE'

}
#### DEV CLOUD END ###

function setupComm(){
    dockerPrerequisites

    echo $'\nAbout to create a docker machine with the following name: '${KEYSTORE_MACHINE}

    local machineExist=`docker-machine inspect --format '{{ .Name }}' ${KEYSTORE_MACHINE}`
    if [ "${machineExist}" == "${KEYSTORE_MACHINE}" ]; then
        echo $'\ndocker machine: '${KEYSTORE_MACHINE}' already exist, trying to force restart'
        docker-machine stop ${KEYSTORE_MACHINE}
        docker-machine start ${KEYSTORE_MACHINE}
        docker-machine regenerate-certs -f ${KEYSTORE_MACHINE}
    else
        docker-machine create --driver rackspace --rackspace-api-key $rkapikey --rackspace-username $rkusername --rackspace-region IAD ${KEYSTORE_MACHINE}
    fi

    cleanContainers ${KEYSTORE_MACHINE}
    docker $(docker-machine config ${KEYSTORE_MACHINE}) run -d -p "8500:8500" -h "consul" progrium/consul -server -bootstrap
    echo $'\n .....'${KEYSTORE_MACHINE}' setup DONE'
}
function setupSwarmMaster(){
    local machineName=${1}
    dockerPrerequisites

    echo $'\nAbout to create a docker machine with the following name: '${machineName}

    local machineExist=`docker-machine inspect --format '{{ .Name }}' ${machineName}`
    if [ "${machineExist}" == "${machineName}" ]; then
        echo $'\ndocker machine: '${machineName}' already exist, trying to force restart'
        docker-machine stop ${machineName}
        docker-machine start ${machineName}
        docker-machine regenerate-certs -f ${machineName}
    else
        docker-machine create \
         -d rackspace \
         --swarm --swarm-master \
         --swarm-discovery="consul://$(docker-machine ip ${KEYSTORE_MACHINE}):8500" \
         --engine-opt="cluster-store=consul://$(docker-machine ip ${KEYSTORE_MACHINE}):8500" \
         --engine-opt="cluster-advertise=eth1:2376" \
         --rackspace-api-key $rkapikey \
         --rackspace-username $rkusername \
         --rackspace-region IAD ${machineName}
    fi

    echo $'\n .....'${machineName}' setup DONE'

    eval "$(docker-machine env --swarm ${machineName})"
    docker network create --driver overlay soajsnet
    echo $'\n .....Container Network setup DONE'
}
function welcome(){
    clear
    echo "Welcome to the SOAJS docker-machine Cloud Deployer."
    echo ""
}
function setupcloud(){
    while [ "$cloudchoice" != "y" ]
     do
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
      read cloudchoice
    done
}
function whichdomain(){
    local answerinput=""
    while [ "$answerinput" != "y" ]
     do
      clear
      echo "$API_DOMAIN is the default domain location."
      echo ""
      echo -n "Would what you like to use for this domain? Such as stg-api.mydomain.com or prod.xyz.com"
      echo $'\n'
      echo -n "Domain name: "
      read domainchoice
      if [ -z "$domainchoice" ]; then
         domainchoice="api.mydomain.com"
         echo ""
         echo "default chosen: $domainchoice"
      else
        echo ""
        echo "Choice: $domainchoice"
      fi
      echo ""
      echo -n "Are you sure (y or n): "
      read answerinput
    done
    API_DOMAIN=$domainchoice
}
function addanotherserver(){
    while [ "$servernamechoice" != "y" ]
     do
      clear
      echo -n "What would you like to call your new Environment Machine (stg - cat - prod ...)"
      echo $'\n'
      echo -n "Environment Machine name: "
      read newmachinename
      newmachinename="$(tr [A-Z] [a-z] <<< "$newmachinename")"
      echo ""
      echo "Machine name: $newmachinename"
      echo ""
      echo -n "Is the above correct (y or n): "
      read servernamechoice
     done
    whichdomain
    createDockerMachine "soajs-$newmachinename"
    DATA_CONTAINER="$newmachinename-"
    setupDevEnv "soajs-$newmachinename"
}
function choices(){
    local answerinput=""
    while [ "$answerinput" != "y" ]
     do
      echo ""
      echo "1. Install"
      echo "2. Rebuild all containers"
      echo "3. Rebuild all containers but mongodb"
      echo "4. Create a new Environment Machine"
      echo ""
      echo -n "What would you like to do: "
      read gochoice
      echo ""
      echo ""
      echo "Choice: $gochoice"
      echo ""
      echo -n "Are you sure (y or n): "
      read answerinput
    done
    DEPLOY_FROM=$choicepull
}
function gochoice(){

    if [ ${gochoice} == "1" ]; then
        setupcloud
        whichdomain
        setupComm
        setupSwarmMaster "soajs-swarm-master"
        createDockerMachine "soajs-dash"
        createDockerMachine "soajs-dev"
        pullNeededImages "soajs-dev"
        pullNeededImages "soajs-dash"
        setupDashEnv "soajs-dash" "soajs-dev"
        setupDevEnv "soajs-dev"
    elif [ ${gochoice} == "2" ]; then
        setupDashEnv "soajs-dash" "soajs-dev"
        setupDevEnv "soajs-dev"
    elif [ ${gochoice} == "3" ]; then
        cleanContainers soajs-dash "mongo"
        start soajs-dash
        cleanContainers soajs-dev "mongo"
    elif [ ${gochoice} == "4" ]; then
        addanotherserver
    else
        clear
        echo "Nothing executed."
        echo ""
    fi

}
welcome
setupcloud
choices
gochoice

echo "$INSTRUCT_MSG"

