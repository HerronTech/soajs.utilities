'use strict';
var dashboard = {
	"_id": ObjectId('55128442e603d7e01ab1688c'),
	"code": "DASHBOARD",
	"locked": true,
	"port": 80,
	"docker": {
		"local": {
			'host': '192.168.59.103',
			'port': 2376
		}
	},
	"description": "this is the Dashboard environment",
	"dbs": {
		"clusters": {
			"cluster1": {
				"servers": [
					{
						"host": "dataProxy01",
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
				"autoRelaodRegistry": 1000 * 60 * 60, // 1 hr
				"maxLogCount": 5,
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
				"cookie": {
					"path": '/',
					"httpOnly": true,
					"secure": false,
					"domain": "soajs.com",
					"maxAge": null
				},
				"resave": false,
				"saveUninitialized": false,
				"rolling": false,
				"unset": "keep"
			}
		}
	}
};