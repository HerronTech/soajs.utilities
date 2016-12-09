var service = {
	"_id": '584a92895a718a4e37ecffde',
	"name": "artifact",
	"port": 4999,
	"group": "SOAJS artifact",
	"src": {
		"provider": "github",
		"owner": "soajs",
		"repo": "soajs.artifact"
	},
	"requestTimeout": null,
	"requestTimeoutRenewal": null,
	"versions": {
		"1": {
			"extKeyRequired": false,
			"awareness": true,
			"apis": [
				{
					"l": "Get contact by ID",
					"v": "/contact/:id",
					"group": "Basic"
				},
				{
					"l": "Get contacts matching a query",
					"v": "/contact/match/:q",
					"group": "Advance",
					"groupMain": true
				},
				{
					"l": "Get all contacts",
					"v": "/contacts",
					"group": "Basic",
					"groupMain": true
				},
				{
					"l": "Add new Contact(s)",
					"v": "/contact",
					"group": "Basic"
				},
				{
					"l": "Update contact by ID",
					"v": "/contact/:id",
					"group": "Basic"
				},
				{
					"l": "Delete contact by ID",
					"v": "/contact/:id",
					"group": "Basic"
				}
			]
		}
	}
};

module.exports = service;