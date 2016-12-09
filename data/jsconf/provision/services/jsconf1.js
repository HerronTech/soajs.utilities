var jsconf1 = {
	"_id": '584a6f4c59f84bf55fe0de32',
	"name": "jsconf1",
	"group": "JSConf",
	"src":{
		"provider":"github",
		"owner":"soajs",
		"repo":"soajs.jsconf",
		"main":"/services/s1/."
	},
	"port": 4111,
	"requestTimeout": 30,
	"requestTimeoutRenewal": 5,
	"versions": {
		"1": {
			"extKeyRequired": false,
			"apis": [
				{
					"l": "Hello World",
					"v": "/hello",
					"m": "",
					"group": "Hello",
					"groupMain": true
				}
			],
			"awareness": true
		}
	}
};

module.exports = jsconf1;