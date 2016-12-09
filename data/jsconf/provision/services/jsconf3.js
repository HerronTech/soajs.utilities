var jsconf3 = {
	"_id": '584a70c459f84bf55fe0de36',
	"name": "jsconf3",
	"group": "JSConf",
	"src":{
		"provider":"github",
		"owner":"soajs",
		"repo":"soajs.jsconf",
		"main":"/services/s3/."
	},
	"port": 4113,
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

module.exports = jsconf3;