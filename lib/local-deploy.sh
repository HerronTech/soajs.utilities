#!/usr/bin/env bash

DATA_CONTAINER='soajsData'
IMAGE_PREFIX='antoinehage'

function createContainer(){
    local WHAT=${1}
    local ENV='-e NODE_ENV=production -e SOAJS_ENV=dashboard -e SOAJS_PROFILE=/opt/soajs/FILES/profiles/single.js -e SOAJS_SRV_AUTOREGISTERHOST=true'
    local VLM='-v /Users/soajs/FILES:/opt/soajs/FILES -v /Users/soajs/open_source/services/'${WHAT}':/opt/soajs/node_modules/'${WHAT}''

    echo $'\n- Starting Controller Container '${WHAT}' ...'

    if [ ${WHAT} == "dashboard" ]; then
        local EXTRA='-e "SOAJS_ENV_WORKDIR=/Users/" -v /Users/soajs:/Users/soajs -v /var/run/docker.sock:/var/run/docker.sock'
        docker run -d --link ${DATA_CONTAINER}:dataProxy01 ${ENV} ${VLM} ${EXTRA} -i -t --name ${WHAT} ${IMAGE_PREFIX}/soajs bash -c 'cd /opt/soajs/node_modules/'${WHAT}'/; npm install; /opt/soajs/FILES/scripts/runService.sh /opt/soajs/node_modules/'${WHAT}/'index.js'
    else
        docker run -d --link ${DATA_CONTAINER}:dataProxy01 ${ENV} ${VLM} -i -t --name ${WHAT} ${IMAGE_PREFIX}/soajs bash -c 'cd /opt/soajs/node_modules/'${WHAT}'/; npm install; /opt/soajs/FILES/scripts/runService.sh /opt/soajs/node_modules/'${WHAT}'/index.js'
    fi

    echo $'\n--------------------------'
}

###################################
#SOAJSDATA container
###################################
echo "0- Building /data folder inside VM"
boot2docker ssh "sudo mkdir -p /data; sudo chgrp staff -R /data; sudo chmod 775 -R /data; exit"

echo "1- Cleaning previous docker containers ..."
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
echo $'\n--------------------------'

echo $'\n2- Starging Mongo Container "soajsData" ...'
docker run -d -p 27017:27017 -v /data:/data -v /data/db:/data/db --name ${DATA_CONTAINER} mongo mongod --smallfiles
echo $'\n--------------------------'

#get mongo container IP address
MONGOIP=`boot2docker ip`
echo $'\nMongo ip is: '${MONGOIP}
sleep 2
#import provisioned data to mongo
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

###################################
#NGINX container
###################################
sleep 5
echo $'\n6- Starting NGINX Container "nginx" ... '
docker run -d --link controller:controllerProxy01 -p 80:80 -e "SOAJS_NX_NBCONTROLLER=1" -e "SOAJS_NX_APIDOMAIN=dashboard-api.soajs.org" -e "SOAJS_NX_DASHDOMAIN=dashboard.soajs.org" -e "SOAJS_NX_APIPORT=80" -v /Users/soajs/open_source/dashboard:/opt/soajs/dashboard/ -v /Users/soajs/FILES:/opt/soajs/FILES --name nginx ${IMAGE_PREFIX}/nginx bash -c '/opt/soajs/FILES/scripts/runNginx.sh'
echo $'\n--------------------------'

echo $'\n7- Containers created and deployed:'
docker ps
echo $'\n 5 containers started, please login to the dashboard @ http://dashboard.soajs.org'

