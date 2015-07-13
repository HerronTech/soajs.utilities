#!/usr/bin/env bash

###################################
#Terminal 1:
#SOAJSDATA container
###################################
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)

docker run -p 27017:27017 -v http://127.0.0.1/Users/soajs/data:/data -v http://127.0.0.1/Users/soajs/data/db:/data/db --name soajsData mongo mongod --smallfiles

#get mongo container IP address
MONGOIP=`docker inspect --format '{{ .NetworkSettings.IPAddress }}' soajsData`
echo $'\nMongo ip is: '${MONGOIP}

#import provisioned data to mongo
node index data import provision ${MONGOIP}
node index data import urac ${MONGOIP}

###################################
#Terminal 2:
#URAC container
###################################
docker run --link soajsData:dataProxy01 -e "NODE_ENV=production" -e "SOAJS_ENV=dashboard" -e "SOAJS_PROFILE=/opt/soajs/FILES/profiles/single.js" -e "SOAJS_SRV_AUTOREGISTER=true" -v http://127.0.0.1/Users/soajs/services/urac:/opt/soajs/urac -v http://127.0.0.1/Users/soajs/FILES/profiles:/opt/soajs/FILES/profiles -i -t --name urac antoinehage/soajs bash -c 'cd /opt/soajs/urac/; npm install; /opt/soajs/FILES/runService.sh /opt/soajs/urac/index.js'

#alternative cmd:
#docker run --link soajsData:dataProxy01 -e "NODE_ENV=production" -e "SOAJS_ENV=dashboard" -e "SOAJS_PROFILE=/opt/soajs/FILES/profiles/single.js" -e "SOAJS_SRV_AUTOREGISTER=true" -v http://127.0.0.1/Users/soajs/services/urac:/opt/soajs/urac -i -t --name urac antoinehage/soajs bash -c 'cd /opt/soajs/urac/; npm install; /opt/soajs/FILES/runService.sh /opt/soajs/urac/index.js'

###################################
#Terminal 3:
#DASHBOARD container
###################################
docker run --link soajsData:dataProxy01 -e "NODE_ENV=production" -e "SOAJS_ENV=dashboard" -e "SOAJS_PROFILE=/opt/soajs/FILES/profiles/single.js" -e "SOAJS_SRV_AUTOREGISTER=true" -v http://127.0.0.1/Users/soajs/services:/opt/soajs/services -v /Users/soajs/services/dashboard:/opt/soajs/dashboard -v http://127.0.0.1/Users/soajs/FILES/profiles:/opt/soajs/FILES/profiles -v http://127.0.0.1/Users/soajs/uploads:/opt/soajs/uploads -v http://127.0.0.1/var/run/docker.sock:/var/run/docker.sock -i -t --name dashboard antoinehage/soajs bash -c 'cd /opt/soajs/dashboard/; npm install; /opt/soajs/FILES/runService.sh /opt/soajs/dashboard/index.js'

#alternative cmd:
#docker run --link soajsData:dataProxy01 -e "NODE_ENV=production" -e "SOAJS_ENV=dashboard" -e "SOAJS_PROFILE=/opt/soajs/FILES/profiles/single.js" -e "SOAJS_SRV_AUTOREGISTER=true" -v http://127.0.0.1/Users/soajs/services:/opt/soajs/services -v http://127.0.0.1/Users/soajs/uploads:/opt/soajs/uploads -v http://127.0.0.1/var/run/docker.sock:/var/run/docker.sock -v /Users/soajs/services/dashboard:/opt/soajs/dashboard -i -t --name dashboard antoinehage/soajs bash -c 'cd /opt/soajs/dashboard/; npm install; /opt/soajs/FILES/runService.sh /opt/soajs/dashboard/index.js'

###################################
#Terminal 4:
#CONTROLLER container
###################################
docker run --link soajsData:dataProxy01 -e "SOAJS_ENV=dashboard" -e "NODE_ENV=production" -e "SOAJS_PROFILE=/opt/soajs/FILES/profiles/single.js" -e "SOAJS_SRV_AUTOREGISTER=true" -v http://127.0.0.1/Users/soajs/services/controller:/opt/soajs/controller -v http://127.0.0.1/Users/soajs/FILES/profiles:/opt/soajs/FILES/profiles -i -t --name controller antoinehage/soajs bash -c 'cd /opt/soajs/controller/; npm install; /opt/soajs/FILES/runService.sh /opt/soajs/controller/index.js'

#alternative cmd:
#docker run --link soajsData:dataProxy01 -e "SOAJS_ENV=dashboard" -e "NODE_ENV=production" -e "SOAJS_PROFILE=/opt/soajs/FILES/profiles/single.js" -e "SOAJS_SRV_AUTOREGISTER=true" -v http://127.0.0.1/Users/soajs/services/controller:/opt/soajs/controller -i -t --name controller antoinehage/soajs bash -c 'cd /opt/soajs/controller/; npm install; /opt/soajs/FILES/runService.sh /opt/soajs/controller/index.js'

###################################
#Terminal 5:
#NGINX container
###################################
docker run --link controller:controllerProxy01 -p 80:80 -e "SOAJS_NX_NBCONTROLLER=1" -e "SOAJS_NX_APIDOMAIN=dashboard-api.soajs.org" -e "SOAJS_NX_DASHDOMAIN=dashboard.soajs.org" -e "SOAJS_NX_APIPORT=80" -v http://127.0.0.1/Users/soajs/dashboard:/opt/soajs/dashboard/ --name nginx antoinehage/nginx