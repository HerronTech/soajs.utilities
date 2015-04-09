'use strict';
var dServers = require("../configurations/servers");
var dOptions = require("../configurations/options");


var registry = {
	"name": "dev",
	"version": "0.0",
	"environment": "develop", // develop || production
	"tenantMetaDB": {
		"urac": {
			"name": "#TENANT_NAME#_urac",
			"prefix": dServers.prefix,
			"servers": dServers.servers,
			"credentials": dServers.credentials,
			"URLParam": dOptions.URLParam,
			"extraParam": dOptions.extraParam
		}
	},

	"coreDB": {
		"provision": {
			"name": "core_provision",
			"prefix": dServers.prefix,
			"servers": dServers.servers,
			"credentials": dServers.credentials,
			"URLParam": dOptions.URLParam,
			"extraParam": dOptions.extraParam
		},
		"session": {
			"name": "core_session",
			"prefix": dServers.prefix,
			"servers": dServers.servers,
			"credentials": dServers.credentials,
			"URLParam": dOptions.URLParam,
			"extraParam": dOptions.extraParam,
			'store': {},
			"collection": "sessions",
			'stringify': false,
			'expireAfter': 1000 * 60 * 60 * 24 * 14 // 2 weeks
		}
	},

	"serviceConfig": {
		"key": {
			"algorithm": 'aes256',
			"password": 'soajs key lal massa'
		},
		"logger": {
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
		"maintenancePortInc": 1000,
		"cookie": {"secret": "this is a secret sentence"},
		"session": {
			"name": "soajsID",
			"secret": "this is antoine hage app server",
			"cookie": {"path": '/', "httpOnly": true, "secure": false, "domain": "soajs.com", "maxAge": null},
			"resave": false,
			"saveUninitialized": false
		}
	},
	"services": {
		"controller": {
			"port": 4000,
			"host": "127.0.0.1",
			"maxPoolSize": 100,
			"requestTimeout": 30,
			"requestTimeoutRenewal": 0,
			"authorization": true
		},
		"urac": {
			"extKeyRequired": true,
			"port": 4001,
			"host": "127.0.0.1",
			"url": "http://127.0.0.1:4000/urac",
			"mail": {
				"join": "mail/urac/join.tmpl",
				"forgotPassword": "mail/urac/forgotPassword.tmpl",
				"addUser": "mail/urac/addUser.tmpl",
				"changeUserStatus": "mail/urac/changeUserStatus.tmpl",
				"changeEmail": "mail/urac/changeEmail.tmpl"
			}
		},
		"dashboard": {
			"extKeyRequired": true,
			"port": 4003,
			"host": "127.0.0.1",
			"url": "http://127.0.0.1:4000/dashboard"
		}
	}
};

module.exports = registry;
