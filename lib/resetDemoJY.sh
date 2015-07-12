#!/bin/bash

WRKDIR='/Users/'

eval "$(./sdc-docker-setup.sh https://us-east-1.api.joyent.com SOAJS ~/.ssh/id_rsa_jy)"

docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)

mkdir -p ${WRKDIR}data/db

docker run -d -p 27017:27017 -v http://127.0.0.1${WRKDIR}data:/data -v http://127.0.0.1${WRKDIR}data/db:/data/db --name soajsData mongo mongod --smallfiles

MONGOIP=`docker inspect --format '{{ .NetworkSettings.IPAddress }}' soajsData`

echo $'\nMongo ip is: '${MONGOIP}

node index data import provision ${MONGOIP}
node index data import urac ${MONGOIP}

