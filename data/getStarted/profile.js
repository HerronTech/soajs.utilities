'use strict';

module.exports = {
	"name": "core_provision",
	"prefix": "getStarted_",
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
			"native_parser": true,
			"bufferMaxEntries": 0
		},
		"server": {
			"socketOptions": {
				"autoReconnect": false
			}
		}
	}
};