var jsconf2 = {
	"_id": '584a6f7759f84bf55fe0de34',
	"name": "jsconf2",
	"group": "JSConf",
	"src": {
		"provider": "github",
		"owner": "soajs",
		"repo": "soajs.jsconf",
		"main": "/services/s2/."
	},
	"port": 4112,
	"requestTimeout": 30,
	"requestTimeoutRenewal": 5,
	"versions": {
		"1": {
			"extKeyRequired": true,
			"apis": [
				{
					"l": "Hello World",
					"v": "/hello",
					"m": "",
					"group": "Hello",
					"groupMain": true
				},
				{
					"l": "Add Info to Standalone DB",
					"v": "/standalone/add",
					"m": "",
					"group": "Information",
					"groupMain": true
				}
			],
			"awareness": true
		}
	}
};

module.exports = jsconf2;