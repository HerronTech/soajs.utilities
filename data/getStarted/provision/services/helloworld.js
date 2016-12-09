var helloworld = {
	"_id": '584ab6fd59f84bf55fe0de46',
	"name": "helloworld",
	"group": "SOAJS Example Service",
	"port": 4020,
	"requestTimeout": 30,
	"requestTimeoutRenewal": 5,
	"versions": {
		"1": {
			"extKeyRequired": false,
			"apis": [
				{
					"l": "hello world",
					"v": "/hello",
					"m": ""
				}
			],
			"awareness": true
		}
	}
};

module.exports = helloworld;