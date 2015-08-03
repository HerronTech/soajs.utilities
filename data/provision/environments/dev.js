'use strict';
var dev = {
	"code": "DEV",
	"port": 8080,
	"profile": "/opt/soajs/FILES/profiles/single.js",
	"description": "this is the DEV environment",
	"deployer": {
		"type": "manual", //available options: container | manual | cloud (chef | puppet)
		"container": {
			"selected": "docker.socket",
			"docker": {
				"selected": "socket",
				"socket": {
					'socketPath': '/var/run/docker.sock'
				},
				"boot2docker": {
					'host': '192.168.59.103',
					'port': 2376
				},
				"joyent": {
					'host': 'us-east-1.docker.joyent.com',
					'port': 2376
				}
			},
			"coreos": { //coming soon

			}
		},
		"cloud": {	//coming soon
			"joyent": {},
			"AWS": {},
			"gCloud": {},
			"azure": {}
		}
	},
	"dbs": {
		"clusters": {
			"cluster1": {
				"servers": [
					{
						"host": "127.0.0.1",
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
				"autoRegisterService": true //register at the controller or not
			},
			"agent": {
				"topologyDir": "/opt/soajs/"
			},
			"key": {
				"algorithm": 'aes256',
				"password": 'soajs encryption key'
			},
			"logger": { //ATTENTION: this is not all the properties for logger
				"src": true,
				"level": "debug",
				"formatter": {
					outputMode: 'long'
				}
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
			"ports": {
				"controller": 4000,
				"maintenanceInc": 1000,
				"randomInc": 100
			},
			"cookie": {
				"secret": "this is a secret sentence"
			},
			"session": {
				"name": "soajsID",
				"secret": "My Secret Phrase",
				"cookie": {
					"path": '/',
					"httpOnly": true,
					"secure": false,
					"domain": "myDomain.com",
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