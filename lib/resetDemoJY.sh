#!/bin/bash

WRKDIR='/Users/'

eval "$(./sdc-docker-setup.sh https://us-east-1.api.joyent.com SOAJS ~/.ssh/id_rsa_jy)"

docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)

docker run -p 27017:27017 -v ${WRKDIR}data:/data -v ${WRKDIR}data/db:/data/db --name soajsData mongo mongod --smallfiles

MONGOIP=`docker inspect --format '{{ .NetworkSettings.IPAddress }}' soajsData`

echo "Mongo ip is: ${MONGOIP}"

node index data import provision ${MONGOIP}
node index data import urac ${MONGOIP}

