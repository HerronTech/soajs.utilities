#!/usr/bin/env bash

######
# after executing docker run ... had to execute sleep 5 before starting the service so that the correct ip gets assigned
######

#mongo container
docker run -p 27017:27017 -v /Users/mikehajj/soajs/data/db:/data/db --name soajsData mongo mongod --smallfiles

#urac container
docker run --link soajsData:dataProxy01 -e "NODE_ENV=production" -e "SOAJS_ENV=dashboard" -e "SOAJS_PROFILE=/opt/soajs/FILES/profiles/single.js" -e "SOAJS_SRV_AUTOREGISTER=true" -v /Users/mikehajj/soajs/services/urac:/opt/soajs/urac -v /Users/mikehajj/soajs/FILES/profiles:/opt/soajs/FILES/profiles -i -t --name urac soajsorg/soajs bash -c 'sleep 5; cd /opt/soajs/urac/; npm install; node .'

#dashboard container
docker run --link soajsData:dataProxy01 -e "NODE_ENV=production" -e "SOAJS_ENV=dashboard" -e "SOAJS_PROFILE=/opt/soajs/FILES/profiles/single.js" -e "SOAJS_SRV_AUTOREGISTER=true" -v /Users/mikehajj/soajs/services/dashboard:/opt/soajs/dashboard -v /Users/mikehajj/soajs/FILES/profiles:/opt/soajs/FILES/profiles -v /Users/mikehajj/soajs/uploads:/opt/soajs/uploads -v /var/run/docker.sock:/var/run/docker.sock -i -t --name dashboard soajsorg/soajs bash -c 'sleep 5; cd /opt/soajs/dashboard/; npm install; node .'

#controller container
docker run --link soajsData:dataProxy01 -e "SOAJS_ENV=dashboard" -e "NODE_ENV=production" -e "SOAJS_PROFILE=/opt/soajs/FILES/profiles/single.js" -e "SOAJS_SRV_AUTOREGISTER=true" -v /Users/mikehajj/soajs/services/controller:/opt/soajs/controller -v /Users/mikehajj/soajs/FILES/profiles:/opt/soajs/FILES/profiles -i -t --name controller soajsorg/soajs bash -c 'sleep 5; cd /opt/soajs/controller/; npm install; node .'

#nginx container
docker run --link controller:controllerProxy01 --link controller:controllerProxy02 -p 80:8080 -e "SOAJS_NX_NBCONTROLLER=2" -e "SOAJS_NX_APIDOMAIN=dashboard-api.soajs.org" --name nginxapi soajsorg/nginxapi