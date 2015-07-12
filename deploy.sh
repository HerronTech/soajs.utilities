#!/usr/bin/env bash

###################################
#Terminal 1:
#SOAJSDATA container
###################################
docker run -p 27017:27017 -v /Users/soajs/data:/data -v /Users/soajs/data/db:/data/db --name soajsData mongo mongod --smallfiles

###################################
#Terminal 2:
#URAC container
###################################
docker run --link soajsData:dataProxy01 -e "NODE_ENV=production" -e "SOAJS_ENV=dashboard" -e "SOAJS_PROFILE=/opt/soajs/FILES/profiles/single.js" -e "SOAJS_SRV_AUTOREGISTER=true" -v /Users/soajs/services/urac:/opt/soajs/urac -v /Users/soajs/FILES/profiles:/opt/soajs/FILES/profiles -i -t --name urac antoinehage/soajs bash -c 'cd /opt/soajs/urac/; npm install; /opt/soajs/FILES/runService.sh /opt/soajs/urac/index.js'

###################################
#Terminal 3:
#DASHBOARD container
###################################
docker run --link soajsData:dataProxy01 -e "NODE_ENV=production" -e "SOAJS_ENV=dashboard" -e "SOAJS_PROFILE=/opt/soajs/FILES/profiles/single.js" -e "SOAJS_SRV_AUTOREGISTER=true" -v /Users/soajs/services/dashboard:/opt/soajs/dashboard -v /Users/soajs/FILES/profiles:/opt/soajs/FILES/profiles -v /Users/soajs/uploads:/opt/soajs/uploads -v /var/run/docker.sock:/var/run/docker.sock -i -t --name dashboard antoinehage/soajs bash -c 'cd /opt/soajs/dashboard/; npm install; /opt/soajs/FILES/runService.sh /opt/soajs/dashboard/index.js'

###################################
#Terminal 4:
#CONTROLLER container
###################################
docker run --link soajsData:dataProxy01 -e "SOAJS_ENV=dashboard" -e "NODE_ENV=production" -e "SOAJS_PROFILE=/opt/soajs/FILES/profiles/single.js" -e "SOAJS_SRV_AUTOREGISTER=true" -v /Users/soajs/services/controller:/opt/soajs/controller -v /Users/soajs/FILES/profiles:/opt/soajs/FILES/profiles -i -t --name controller antoinehage/soajs bash -c 'cd /opt/soajs/controller/; npm install; /opt/soajs/FILES/runService.sh /opt/soajs/controller/index.js'

###################################
#Terminal 5:
#NGINX container
###################################
docker run --link controller:controllerProxy01 --link controller:controllerProxy02 -p 80:8080 -e "SOAJS_NX_NBCONTROLLER=2" -e "SOAJS_NX_APIDOMAIN=dashboard-api.soajs.org" --name nginxapi antoinehage/nginx