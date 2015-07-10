#!/bin/bash

echo "Restarting boot2docker"
boot2docker stop
boot2docker start

echo "Cleaning all containers"
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)

echo "Building /data folder inside VM"
boot2docker ssh "sudo mkdir -p /data; sudo chgrp staff -R /data; sudo chmod 775 -R /data; exit"


#boot2docker ssh
#sudo mkdir -p /data
#sudo chgrp staff -R /data
#sudo chmod 775 -R /data
#exit

sleep 3
echo "Building soajsData container"
docker run -d -p 27017:27017 -v /data:/data -v /data/db:/data/db --name soajsData mongo mongod --smallfiles

sleep 3
echo "Importing default configuration into soajsData"
node index data import provision $(boot2docker ip)
node index data import urac $(boot2docker ip)

docker ps -a

echo "DONE"