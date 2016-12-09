var example01 = {
	"_id": '584a6ceb59f84bf55fe0de25',
	"name": "example01",
	"group": "SOAJS Example Service",
	"src":{
		"provider":"github",
		"owner":"soajs",
		"repo":"soajs.examples",
		"main":"/example01/."
	},
	"port": 4010,
	"requestTimeout": 30,
	"requestTimeoutRenewal": 5,
	"versions": {
		"1": {
			"extKeyRequired": false,
			"apis": [
				{
					"l": "Test Get",
					"v": "/testGet",
					"m": ""
				},
				{
					"l": "Test Delete",
					"v": "/testDel",
					"m": ""
				},
				{
					"l": "Build Name",
					"v": "/buildName",
					"m": ""
				},
				{
					"l": "Test Post",
					"v": "/testPost",
					"m": ""
				},
				{
					"l": "Test Put",
					"v": "/testPut",
					"m": ""
				}
			],
			"awareness": true
		}
	}
};

module.exports = example01;