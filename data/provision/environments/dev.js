'use strict';
var dev = {
    "_id": ObjectId('55128442e603d7e01ab1688c'),
    "code": "DEV",
    "locked": true,
    "description": "this is the DEV environment",
    "ips": [
        "127.0.0.1"
    ],
    "dbs": {
        "clusters": {
            "cluster1": {
                "servers": [
                    {
                        "host": "dataProxy",
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
                        "native_parser": true
                    },
                    "server": {
                        "auto_reconnect": true
                    }
                }
            }
        },
        "config": {
            "prefix": "",
            "session": {
                "cluster": "cluster1",
                "name": "core_session",
                'store': {},
                "collection": "sessions",
                'stringify': false,
                'expireAfter': 1000 * 60 * 60 * 24 * 14 // 2 weeks
            }
        },
        "databases": {
            "urac": {
                "cluster": "cluster1",
                "tenantSpecific": true
            }
        }
    },
    "services": {
        "controller": {
            "maxPoolSize": 100,
            "authorization": true,
            "requestTimeout": 30,
            "requestTimeoutRenewal": 0
        },
        "config": {
            "awareness": {
                "healthCheckInterval": 1000 * 5, // 5 seconds
                "autoRelaodRegistry": 1000 * 60 * 5, // 5 minutes
                "maxLogcount":5,
                "autoRegisterService": true
            },
            "agent": {
                "topologyDir": "/opt/soajs/"
            },
            "key": {
                "algorithm": 'aes256',
                "password": 'soajs key lal massa'
            },
            "logger": { //ATTENTION: this is not all the properties for logger
                "src": true,
                "level": "debug"
            },
            "cors": {
                "enabled": true,
                "origin": '*',
                "credentials": 'true',
                "methods": 'GET,HEAD,PUT,PATCH,POST,DELETE',
                "headers": 'key,soajsauth,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type',
                "maxage": 1728000
            },
            "oauth": {
                "grants": ['password', 'refresh_token'],
                "debug": false
            },
            "ports": {"controller": 4000, "maintenanceInc": 1000, "randomInc": 100},
            "cookie": {"secret": "this is a secret sentence"},
            "session": {
                "name": "soajsID",
                "secret": "this is antoine hage app server",
                "cookie": {"path": '/', "httpOnly": true, "secure": false, "domain": "soajs.com", "maxAge": null},
                "resave": false,
                "saveUninitialized": false
            }
        }
    }
};