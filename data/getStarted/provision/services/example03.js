var example03 = {
	"_id": '584a6ca859f84bf55fe0de21',
	"name": "example03",
	"group": "SOAJS Example Service",
	"src": {
		"provider": "github",
		"owner": "soajs",
		"repo": "soajs.examples",
		"main": "/example03/."
	},
	"port": 4012,
	"requestTimeout": 30,
	"requestTimeoutRenewal": 5,
	"versions": {
		"1": {
			"extKeyRequired": true,
			"apis": [
				{
					"l": "Test Get",
					"v": "/testGet",
					"m": ""
				},
				{
					"l": "Build Name",
					"v": "/buildName",
					"m": ""
				}
			],
			"awareness": true
		}
	}
};

module.exports = example03;