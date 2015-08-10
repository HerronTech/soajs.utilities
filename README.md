# soajs.utilities
[![NPM version](https://badge.fury.io/js/soajs.utilities.svg)](http://badge.fury.io/js/soajs.utilities)

SOAJS Utilities has 2 functions: 
1. The ability to deploy SOAJS and its core services.
2. The ability to import SOAJS data into mongo or a mongo docker container.

## Deploy SOAJS

**Using Docker**
```sh
cd lib
./dockerDeploy.sh [ NPM | GIT | LOCAL]
```

**Manually**
```sh
cd lib
./manualDeploy.sh [ NPM | GIT | LOCAL]
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