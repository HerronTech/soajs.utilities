#!/bin/bash
#
# Requirement: docker-machine 0.6.0+
#
# https://github.com/docker/machine/releases

GIT_BRANCH="master"
DATA_CONTAINER='soajsData'
IMAGE_PREFIX='soajsorg'
NGINX_CONTAINER='nginx'
KEYSTORE_MACHINE="soajs-v-keystore"
MASTER_MACHINE="soajs-swarm-master"
DASH_MACHINE="soajs-dash"
DEV_MACHINE="soajs-dev"
INSTRUCT_MSG=$'\n\n-------------------------------------------------------------------------------------------'
API_DOMAIN='dev-api.mydomain.com'
ADDSERVER="false"


# Supported export variables
if [ -z $MASTER_DOMAIN ]; then MASTER_DOMAIN='soajs.org'; fi
if [ -z $SOAJS_DNS ]; then SOAJS_DNS="8.8.8.8"; fi
if [ -z $SOAJS_NO_NGINX ]; then SOAJS_NO_NGINX=false; fi
#

function createContainer(){
    local REPO=${1}
    local BRANCH=${2}
    local OWNER="soajs"
    local ENV='--dns='${SOAJS_DNS}' -e NODE_ENV=production -e SOAJS_ENV=dashboard -e SOAJS_PROFILE=/opt/soajs/FILES/profiles/profile.js -e SOAJS_SRV_AUTOREGISTERHOST=true -e SOAJS_MONGO_NB=1 -e SOAJS_MONGO_IP_1='${MACHINEIP}' -e SOAJS_GIT_OWNER='${OWNER}' -e SOAJS_GIT_REPO='${REPO}' -e SOAJS_GIT_BRANCH='${BRANCH}''

    echo $'- Starting Controller Container '${REPO}' ...'
    if [ ${REPO} == "soajs.urac" ]; then
        docker run -d ${ENV} -i -t --name ${REPO} --net=soajsnet ${IMAGE_PREFIX}/soajs bash -c "/etc/init.d/postfix start; cd /opt/soajs/FILES/deployer/; ./soajsDeployer.sh -T service -X deploy"
    elif [ ${REPO} == "soajs.dashboard" ] && [ SOAJS_NO_NGINX=true ]; then
        docker run -d ${ENV} -e ${SOAJS_NO_NGINX} -i -t --name ${REPO} --net=soajsnet ${IMAGE_PREFIX}/soajs bash -c "cd /opt/soajs/FILES/deployer/; ./soajsDeployer.sh -T service -X deploy"
    else
        docker run -d ${ENV} -i -t --name ${REPO} --net=soajsnet ${IMAGE_PREFIX}/soajs bash -c "cd /opt/soajs/FILES/deployer/; ./soajsDeployer.sh -T service -X deploy"
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
    docker pull soajsorg/soajs
    docker pull soajsorg/nginx
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
    createContainer "soajs.urac" "master"
    ###################################
    #DASHBOARD container
    ###################################
    createContainer "soajs.dashboard" "master"
    ###################################
    #PROXY container
    ###################################
    createContainer "soajs.prx" "master"
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

    local BRANCH="master"
    local CONTROLLERIP=`docker inspect --format '{{ .NetworkSettings.Networks.soajsnet.IPAddress }}' soajs.controller`
    echo $'\nStarting NGINX Container "nginx" ... '

    docker run -d -p 443:443 -p 80:80 -e "SOAJS_NX_CONTROLLER_IP_1=${CONTROLLERIP}" -e "SOAJS_NX_CONTROLLER_NB=1" -e "SOAJS_NX_API_DOMAIN=dashboard-api.${MASTER_DOMAIN}" -e "SOAJS_NX_SITE_DOMAIN=dashboard.${MASTER_DOMAIN}" -e "SOAJS_GIT_DASHBOARD_BRANCH="${BRANCH} --name ${NGINX_CONTAINER} --net=soajsnet ${IMAGE_PREFIX}/nginx bash -c "cd /opt/soajs/FILES/deployer/; ./soajsDeployer.sh -T nginx -X deploy"

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
    if [ ${ADDSERVER} == "true" ]; then
       echo $'\nStarting Mongo Container' ${DATA_CONTAINER}' on '${machineName}' '${MONGOIP}' ...'
       docker run -d -p 27017:27017 ${SOAJS_DATA_VLM} --name ${DATA_CONTAINER} --net=soajsnet --env="constraint:node==${machineName}" mongo mongod --smallfiles
       echo $'\n--------------------------'
       echo $'\nMongo ip is: '${MONGOIP}
    else
       echo $'\nStarting Mongo Container' ${DATA_CONTAINER}Dev' on '${machineName}' '${MONGOIP}' ...'
       docker run -d -p 27017:27017 ${SOAJS_DATA_VLM} --name ${DATA_CONTAINER}Dev --net=soajsnet --env="constraint:node==${machineName}" mongo mongod --smallfiles
       echo $'\n--------------------------'
       echo $'\nMongo ip is: '${MONGOIP}
    fi
}
function setupDevEnv(){
    local machineName=${1}
    echo $'\nSetting up cloud for: '${machineName}

    local DEVMACHINEIP=`docker-machine ip ${machineName}`

    cleanContainers ${machineName} "swarm"
    buildDevMongo ${machineName}

  if [ ${ADDSERVER} == "true" ]; then
    INSTRUCT_MSG=${INSTRUCT_MSG}$'\n\t '${DEVMACHINEIP}' '${machineName}
  else
        INSTRUCT_MSG=${INSTRUCT_MSG}$'\n\t '${DEVMACHINEIP}' '${API_DOMAIN}
  fi
    echo $'\n ..... ' ${machineName} 'setup DONE'

}
#### DEV CLOUD END ###
function findswarmmmaster(){
    local confirmmaster=""
    while [ "$confirmmaster" != "y" ]
     do
      clear
      echo "These Swarm Clusters found:"
#      docker-machine ls | grep "keystore-" | sed -e 's/-/ /g' | awk '{ print $1 }'
      docker-machine ls | grep "keystore" | sed -e 's/-/ /g' | awk '{ print $1 }'

      echo ""
      echo -n "What is the name of the Swarm cluster? "
      read swarmname
      checkswarmclustername=$(docker-machine ls | grep "keystore" | sed -e 's/-/ /g' | awk '{ print $1 }' | grep -q ${swarmname} ; echo $?)
      if [ "${checkswarmclustername}" == "0" ]; then
         echo ""
         echo "Swarm cluster name: $swarmname"
         echo ""
         echo -n "Are you sure (y or n): "
         read confirmmaster
      fi
    done

#  This area is ready for June release
    findkeystoremachine=$(docker-machine ls | grep ${swarmname} | grep keystore | awk '{ print $1 }')
    findswarmmaster=$(docker-machine ls | grep ${swarmname} | grep "(master)" | awk '{ print $1 }')
    swarmname="${swarmname}-"
    KEYSTORE_MACHINE="$findkeystoremachine"
    MASTER_MACHINE="$findswarmmaster"

# These two lines are not needed for next June release
    DASH_MACHINE="$swarmname$DASH_MACHINE"
    DEV_MACHINE="$swarmname$DEV_MACHINE" 
}
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
         docker-machine create -d virtualbox ${KEYSTORE_MACHINE}
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
function welcome(){
    clear
    echo "Welcome to the SOAJS docker-machine virtualbox Deployer."
    echo ""
}
function addanotherserver(){
    local servernamechoice=""
    while [ "$servernamechoice" != "y" ]
     do
      echo ""
      echo -n "What would you like to call your new Environment Machine (stg - cat - prod ...)"
      echo $'\n'
      echo -n "Environment Machine name: "
      read newmachinename
      if [ -n "$newmachinename" ] && [[ $newmachinename =~ ^[a-zA-Z]{3,20}$ ]] ; then
         newmachinenametest="${swarmname}soajs-${newmachinename}"
         checknewmachinename=$(docker-machine ls | grep -q "${newmachinenametest}" ; echo $?)
         if [ "$checknewmachinename" = "1" ] ; then
            echo ""
            echo "Machine name: $newmachinename"
            echo ""
            echo -n "Are you sure (y or n): "
            read servernamechoice
         else
            echo ""
            echo "Duplicate name found, choose another name"
         fi
       else
         echo ""
         echo "Please enter a new name using only letters and no spaces" 
       fi
      done
  ADDSERVER="true"
  DATA_CONTAINER="soajsData$newmachinename"
  newmachinename="${swarmname}soajs-${newmachinename}"
  createDockerMachine "$newmachinename"
  pullNeededImages "$newmachinename"
  setupDevEnv "$newmachinename"
}
function rebuildmachinecontainersbutmongo(){
array=($(docker-machine ls -q | grep "soajs-"))

if [ -z "$array" ]; then
   echo "No SOAJS-* machines found, docker ok?"
else
  for i in "${array[@]}"
      do
       if [ $i == "${MASTER_MACHINE}" ] || [ $i == "${KEYSTORE_MACHINE}" ]; then
          echo ""
       elif [ $i == "${DASH_MACHINE}" ]; then
          # rebuild all containers for dash only including mongo
          setupDashEnv "$DASH_MACHINE" "$DEV_MACHINE"
       else
          echo $'\nSetting up cloud for: '${i}
          local DEVMACHINEIP=`docker-machine ip ${i}`
          cleanContainers ${i} "mongo"
#         INSTRUCT_MSG=${INSTRUCT_MSG}$'\n\t '${DEVMACHINEIP}' '${API_DOMAIN}
          echo $'\n ..... ' ${i} 'setup DONE'
       fi
      done
      echo "SOAJS-Dash has now been reset, your mongodb on other machines remained intact."
fi
}
function rebuildmachinecontainers(){
array=($(docker-machine ls -q | grep "${swarmcluster}-"))

if [ -z "$array" ]; then
   echo "No SOAJS-* machines found, docker ok?"
else
  for i in "${array[@]}"
      do
       if [ $i == "${MASTER_MACHINE}" ] || [ $i == "${KEYSTORE_MACHINE}" ]; then
          echo ""
       elif [ $i == "${DASH_MACHINE}" ]; then
          # Do not prompt soajs-dash for a domain
          setupDashEnv "$DASH_MACHINE" "$DEV_MACHINE"
       else
         ADDSERVER="true"
        removenametemp=$(echo "$i" | sed "s/soajs-//" | sed "s/$swarmname//")
        if [ $removenametemp == "dev" ]; then
           DATA_CONTAINER="soajsDataDev"
        else
           DATA_CONTAINER="soajsData$removenametemp"
        fi   
        setupDevEnv $i
       fi 
      done
fi
}
function swarmnamechoice(){
    local swarmnameconfirmation=""
    while [ "$swarmnameconfirmation" != "y" ]
     do
      echo ""
      echo -n "What would you like call this swarm using only letters and no spaces? "
      read swarmname
      if [ -n "$swarmname" ] && [[ $swarmname =~ ^[a-zA-Z]{3,20}$ ]] ; then
         checkswarmclustername=$(docker-machine ls | grep "${swarmname}-" ; echo $?)
         if [ "$checkswarmclustername" = "1" ] ; then
            echo ""
            echo "Swarm name: $swarmname"
            echo ""
            echo -n "Are you sure (y or n): "
            read swarmnameconfirmation
         else
            echo "Duplicate name found, choose another name"
         fi
       else
         echo "Please enter a new name using only letters" 
       fi
    done
    swarmname="$swarmname-"
    KEYSTORE_MACHINE="$swarmname$KEYSTORE_MACHINE"
    MASTER_MACHINE="$swarmname$MASTER_MACHINE"
    DASH_MACHINE="$swarmname$DASH_MACHINE"
    DEV_MACHINE="$swarmname$DEV_MACHINE"
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
        swarmnamechoice
        setupComm
        setupSwarmMaster "$MASTER_MACHINE"
        createDockerMachine "$DASH_MACHINE"
        createDockerMachine "$DEV_MACHINE"
        pullNeededImages "$DEV_MACHINE"
        pullNeededImages "$DASH_MACHINE"
        setupDashEnv "$DASH_MACHINE" "$DEV_MACHINE"
        setupDevEnv "$DEV_MACHINE"
    elif [ ${gochoice} == "2" ]; then
        findswarmmmaster
        rebuildmachinecontainers
    elif [ ${gochoice} == "3" ]; then
        findswarmmmaster
        rebuildmachinecontainersbutmongo
    elif [ ${gochoice} == "4" ]; then
        findswarmmmaster
        addanotherserver
    else
        clear
        echo "Nothing executed."
        echo ""
    fi

}
welcome
choices
gochoice

echo "$INSTRUCT_MSG"
