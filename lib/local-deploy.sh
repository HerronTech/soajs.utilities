#!/usr/bin/env bash

DATA_CONTAINER='soajsData'
IMAGE_PREFIX='antoinehage'
NGINX_CONTAINER='nginx'

function createContainer(){
    local WHAT=${1}
    local ENV='-e NODE_ENV=production -e SOAJS_ENV=dashboard -e SOAJS_PROFILE=/opt/soajs/FILES/profiles/single.js -e SOAJS_SRV_AUTOREGISTERHOST=true'
    local VLM='-v /Users/soajs/FILES:/opt/soajs/FILES -v /Users/soajs/open_source/services/'${WHAT}':/opt/soajs/node_modules/'${WHAT}''

    echo $'- Starting Controller Container '${WHAT}' ...'

    if [ ${WHAT} == "dashboard" ]; then
        local EXTRA='-e "SOAJS_ENV_WORKDIR=/Users/" -v /Users/soajs:/Users/soajs -v /var/run/docker.sock:/var/run/docker.sock'
        docker run -d --link ${DATA_CONTAINER}:dataProxy01 ${ENV} ${VLM} ${EXTRA} -i -t --name ${WHAT} ${IMAGE_PREFIX}/soajs bash -c 'cd /opt/soajs/node_modules/'${WHAT}'/; npm install; /opt/soajs/FILES/scripts/runService.sh /opt/soajs/node_modules/'${WHAT}/'index.js'
    else
        docker run -d --link ${DATA_CONTAINER}:dataProxy01 ${ENV} ${VLM} -i -t --name ${WHAT} ${IMAGE_PREFIX}/soajs bash -c 'cd /opt/soajs/node_modules/'${WHAT}'/; npm install; /opt/soajs/FILES/scripts/runService.sh /opt/soajs/node_modules/'${WHAT}'/index.js'
    fi
}
function program_is_installed {
  # set to 1 initially
  local return_=1
  # set to 0 if not found
  type $1 >/dev/null 2>&1 || { local return_=0; }
  # return value
  echo "$return_"
}

###################################
#SOAJSDATA container
###################################
echo $'Initializing and checking prerequisites ... '
BOOT2DOCKER=$(program_is_installed boot2docker)
if [ ${BOOT2DOCKER} == 1 ]; then
    echo $'\nboot2docker setup identified'
    boot2docker init
    boot2docker start
    eval "$(boot2docker shellinit)"
    MONGOIP=`boot2docker ip`
    boot2docker ssh "sudo mkdir -p /data; sudo chgrp staff -R /data; sudo chmod 775 -R /data; exit"
    SOAJS_DATA_VLM='-v /data:/data -v /data/db:/data/db'
else
    SOAJS_DATA_VLM='-v /Users/soajs/data:/data -v /Users/soajs/data/db:/data/db'
fi
DOCKER=$(program_is_installed docker)
if [ ${DOCKER} == 0 ]; then
    echo $'\n ... Unable to find docker on your machine. PLease install docker!'
    exit
fi
echo $'\n1- Cleaning previous docker containers ...'
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
echo $'\n--------------------------'

echo $'\n2- Starging Mongo Container "soajsData" ...'
docker run -d -p 27017:27017 ${SOAJS_DATA_VLM} --name ${DATA_CONTAINER} mongo mongod --smallfiles
echo $'\n--------------------------'

###################################
# IMPORT DATA
###################################
#get mongo container IP address
if [ ${BOOT2DOCKER} == 1 ]; then
    MONGOIP=`boot2docker ip`
else
    MONGOIP=`docker inspect --format '{{ .NetworkSettings.IPAddress }}' ${DATA_CONTAINER}`
fi
echo $'\nMongo ip is: '${MONGOIP}
#import provisioned data to mongo
sleep 2
echo $'\n3- Importing core provisioned data ...'
node index data import provision ${MONGOIP}
echo $'\n4- Importing URAC data...'
node index data import urac ${MONGOIP}
echo $'\n--------------------------'


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
docker run -d --link controller:controllerProxy01 -p 80:80 -e "SOAJS_NX_NBCONTROLLER=1" -e "SOAJS_NX_APIDOMAIN=dashboard-api.soajs.org" -e "SOAJS_NX_DASHDOMAIN=dashboard.soajs.org" -e "SOAJS_NX_APIPORT=80" -v /Users/soajs/open_source/dashboard:/opt/soajs/dashboard/ -v /Users/soajs/FILES:/opt/soajs/FILES --name ${NGINX_CONTAINER} ${IMAGE_PREFIX}/nginx bash -c '/opt/soajs/FILES/scripts/runNginx.sh'
echo $'\n--------------------------'

###################################
echo $'\n7- Containers created and deployed:'
docker ps
echo $'\n--------------------------'

###################################
#get mongo container IP address
if [ ${BOOT2DOCKER} == 1 ]; then
    NGINXIP=MONGOIP
else
    NGINXIP=`docker inspect --format '{{ .NetworkSettings.IPAddress }}' ${NGINX_CONTAINER}`
fi
echo $'\n\n Add the following to your /etc/hosts file:'
echo $'\t 192.168.59.103 dashboard-api.soajs.org'
echo $'\t 192.168.59.103 dashboard.soajs.org'
echo $'\n Containers started, please login to the dashboard @ http://dashboard.soajs.org'

