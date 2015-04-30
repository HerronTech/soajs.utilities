# soajs.utilities
[![NPM version](https://badge.fury.io/js/soajs.utilities.svg)](http://badge.fury.io/js/soajs.utilities)

SOAJS Utilities has 2 functions: 
1. The ability to build docker images or run docker compose configuration files.
2. The ability to import SOAJS data into a mongo docker containers.

##Build SOAJS docker images

Build SOAJS docker images:

**syntax**:
```sh
node ./lib/index.js docker serviceNPM <PROFILE_PATH> <NPM_PACKAGE> [version]
node ./lib/index.js docker serviceLocal <PROFILE_PATH> <SERVICE_FOLDER>
node ./lib/index.js docker soajsLocal <PROFILE_PATH> <SOAJS_FOLDER>
node ./lib/index.js docker nginx <NGINX_PATH> [DASHBOARD_UI_FOLDER]
```

**Development Environment:**
```sh
# build image from folder /deployment/development/nginx
$ node ./lib/index.js docker buildImage development/nginx

# build image from folder /deployment/development/service
$ node ./lib/index.js docker buildImage development/service
```

**Dashboard Environment:**
```sh
# build image from folder /deployment/cloud/dashboard/nginx
$ node ./lib/index.js docker buildImage cloud/dashboard/nginx

# build image from folder /deployment/cloud/dashboard/controller
$ node ./lib/index.js docker buildImage cloud/dashboard/controller

# build image from folder /deployment/cloud/dashboard/urac_dashboard
$ node ./lib/index.js docker buildImage cloud/dashboard/urac_dashboard
```

**Production Environment:**
```sh
# build image from folder /deployment/cloud/prod/nginx
$ node ./lib/index.js docker buildImage cloud/prod/nginx

# build image from folder /deployment/cloud/prod/controller
$ node ./lib/index.js docker buildImage cloud/prod/controller

# build image from folder /deployment/cloud/prod/urac_oauth
$ node ./lib/index.js docker buildImage cloud/prod/urac_oauth

# build image from folder /deployment/cloud/prod/examples
$ node ./lib/index.js docker buildImage cloud/prod/examples
```

---

##Import SOAJS environment data

Import data to mongo docker containers for: development - dashboard and production environments using the following command(s):  

**syntax**:
```sh
node ./lib/index.js data import <PATH> [CONTAINER_IP]
```

**Ex:**
```sh
# Development Data Layer container
$ node ./lib/index.js data import provision 192.168.0.1
$ node ./lib/index.js data import urac 192.168.0.1

# Dashboard Data Layer container
$ node ./lib/index.js data import provision 192.168.0.1

# Production Data Layer container
$ node ./lib/index.js data import urac 192.168.0.2
```