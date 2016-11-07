#!/usr/bin/env bash

HOST_IP=${1} || ''

if [ ${HOST_IP} == "" ]; then

	echo "Please provide the IP address of the Machine you want to import the data to:"
	echo "ex: ./load.sh 127.0.0.1"
else
	echo $'\nUpdating Database Provisioning ...'
	echo $'\nExecuting: mongo --host '${HOST_IP}' provision.js ...'
	echo $''
	mongo --host ${HOST_IP} provision.js
	echo $'\nDone'
fi