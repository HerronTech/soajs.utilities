var jsconf4 = {
	"_id": '584a70e959f84bf55fe0de38',
	"name": "jsconf4",
	"group": "JSConf",
	"src": {
		"provider": "github",
		"owner": "soajs",
		"repo": "soajs.jsconf",
		"main": "/services/s4/."
	},
	"port": 4114,
	"requestTimeout": 30,
	"requestTimeoutRenewal": 5,
	"versions": {
		"1": {
			"extKeyRequired": true,
			"apis": [
				{
					"l": "Add Info to Standalone DB",
					"v": "/standalone/add",
					"m": "",
					"group": "Information",
					"groupMain": true
				},
				{
					"l": "Add Info in Multitenant DB",
					"v": "/multi/add",
					"m": "",
					"group": "Information",
					"groupMain": true
				},
				{
					"l": "Hybrid API",
					"v": "/hybrid",
					"m": "",
					"group": "Information",
					"groupMain": true
				}
			],
			"awareness": true
		}
	}
};

module.exports = jsconf4;