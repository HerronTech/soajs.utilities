var example04 = {
	"_id": '584a6dbb59f84bf55fe0de29',
	"name": "example04",
	"group": "SOAJS Example Service",
	"port": 4013,
	"requestTimeout": 30,
	"requestTimeoutRenewal": 5,
	"versions": {
		"1": {
			"extKeyRequired": true,
			"apis": [
				{
					"l": "Build Name",
					"v": "/buildName",
					"m": ""
				},
				{
					"l": "Build Name Gold",
					"v": "/buildNameGold",
					"m": ""
				},
				{
					"l": "Test Get",
					"v": "/testGet",
					"m": ""
				}
			],
			"awareness": true
		}
	}
};

module.exports = example04;