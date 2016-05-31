# soajs.utilities
[![NPM version](https://badge.fury.io/js/soajs.utilities.svg)](http://badge.fury.io/js/soajs.utilities)

## Docker Machine Deploy

### DASHBOARD Nginx
Dashboard nginx deployment can be controlled with the below ENV variable for:
* GITHUB
* NGINX

#### GITHUB for custom dashboard repo
ENV Variable | Description | Default | Example
--- | ----- | :---: | ---
SOAJS_GIT_OWNER | This is the GIT account owner name |  | 
SOAJS_GIT_REPO | This is the GIT repo name |  | 
SOAJS_GIT_BRANCH | This the GIT repo branch | [master] | 
SOAJS_GIT_TOKEN | This is the GIT account token |  | 

#### NGINX
ENV Variable | Description | Default | Example
--- | ----- | :---: | ---
SOAJS_NX_MASTER_DOMAIN | This is the master domain for dahsboard | [soajs.org] | yourdomain.com


## DASHBOARD Mongo profile
Dashboard mongo profile for services can be controlled with the below ENV variable for:
* MONGO

#### MONGO for service profile
ENV Variable | Description | Default | Example
--- | ----- | :---: | ---
SOAJS_MONGO_OBJECTROCKET | To turn ON Object Rocket | false | 
SOAJS_MONGO_OBJECTROCKET_URL | This is Object Rocket URL |  | iad1-mongos0.objectrocket.com
SOAJS_MONGO_OBJECTROCKET_PORT | This is the port for evert Mongo instance(s) |  | 16067
SOAJS_MONGO_USERNAME | This is the username for credentials |  | 
SOAJS_MONGO_PASSWORD | This is the password for credentials |  | 