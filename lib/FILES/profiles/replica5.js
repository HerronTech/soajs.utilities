'use strict';

module.exports = {
    "name": "core_provision",
    "prefix": "",
    "servers": [
        {
            "host": "dataProxy01",
            "port": 27017
        },
        {
            "host": "dataProxy02",
            "port": 27017
        },
        {
            "host": "dataProxy03",
            "port": 27017
        },
        {
            "host": "dataProxy04",
            "port": 27017
        },
        {
            "host": "dataProxy05",
            "port": 27017
        }
    ],
    "credentials": null,
    "URLParam": {
        "connectTimeoutMS": 0,
        "socketTimeoutMS": 0,
        "maxPoolSize": 5,
        "wtimeoutMS": 0,
        "slaveOk": true
    },
    "extraParam": {
        "db": {
            "native_parser": true,
            "w": "majority"
        },
        "replSet": {
            "ha": true,
            "readPreference": "secondaryPreferred",
            "rs_name": "rs-soa"
        }
    }
};