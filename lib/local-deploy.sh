#!/usr/bin/env bash

###################################
#Terminal 1:
#SOAJSDATA container
###################################
echo "1- Cleaning previous docker containers ..."
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
echo $'\n--------------------------'

echo $'\n2- Starging Mongo Container "soajsData" ...'
docker run -d -p 27017:27017 -v /data:/data -v /data/db:/data/db --name soajsData mongo mongod --smallfiles
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

###################################
#Terminal 2:
#URAC container
###################################
echo $'\n5- Starting URAC Container "urac" ... '
docker run -d --link soajsData:dataProxy01 -e "NODE_ENV=production" -e "SOAJS_ENV=dashboard" -e "SOAJS_PROFILE=/opt/soajs/FILES/profiles/single.js" -e "SOAJS_SRV_AUTOREGISTER=true" -v /Users/soajs/FILES/profiles:/opt/soajs/FILES/profiles -v /Users/soajs/services/urac:/opt/soajs/urac -i -t --name urac antoinehage/soajs bash -c 'cd /opt/soajs/urac/; npm install; /opt/soajs/FILES/runService.sh /opt/soajs/urac/index.js'
echo $'\n--------------------------'
###################################
#Terminal 3:
#DASHBOARD container
###################################
echo $'\n6- Starting Dashboard Container "dashboard" ... '
docker run -d --link soajsData:dataProxy01 -e "NODE_ENV=production" -e "SOAJS_ENV=dashboard" -e "SOAJS_PROFILE=/opt/soajs/FILES/profiles/single.js" -e "SOAJS_SRV_AUTOREGISTER=true" -v /Users/soajs/FILES/profiles:/opt/soajs/FILES/profiles -v /Users/soajs/services:/opt/soajs/services -v /Users/soajs/services/dashboard:/opt/soajs/dashboard -v /Users/soajs/uploads:/opt/soajs/uploads -v /var/run/docker.sock:/var/run/docker.sock -i -t --name dashboard antoinehage/soajs bash -c 'cd /opt/soajs/dashboard/; npm install; /opt/soajs/FILES/runService.sh /opt/soajs/dashboard/index.js'
echo $'\n--------------------------'
###################################
#Terminal 4:
#CONTROLLER container
###################################
sleep 5
echo $'\n7- Starting Controller Container "controller" ...'
docker run -d --link soajsData:dataProxy01 -e "SOAJS_ENV=dashboard" -e "NODE_ENV=production" -e "SOAJS_PROFILE=/opt/soajs/FILES/profiles/single.js" -e "SOAJS_SRV_AUTOREGISTER=true" -v /Users/soajs/FILES/profiles:/opt/soajs/FILES/profiles -v /Users/soajs/services/controller:/opt/soajs/controller -i -t --name controller antoinehage/soajs bash -c 'cd /opt/soajs/controller/; npm install; /opt/soajs/FILES/runService.sh /opt/soajs/controller/index.js'
echo $'\n--------------------------'
###################################
#Terminal 5:
#NGINX container
###################################
sleep 5
echo $'\n8- Starting NGINX Container "nginx" ... '
docker run -d --link controller:controllerProxy01 -p 80:80 -e "SOAJS_NX_NBCONTROLLER=1" -e "SOAJS_NX_APIDOMAIN=dashboard-api.soajs.org" -e "SOAJS_NX_DASHDOMAIN=dashboard.soajs.org" -e "SOAJS_NX_APIPORT=80" -v /Users/soajs/dashboard:/opt/soajs/dashboard/ --name nginx antoinehage/nginx
echo $'\n--------------------------'

echo $'\n9- Containers created and deployed:'
docker ps
echo $'\n 5 containers started, please login to the dashboard @ http://dashboard.soajs.org'