'use strict';
var client = {
	"_id": ObjectId("5552115ce179c39b760f7a1d"),
	"code": "DCTN",
	"name": "Dashboard Client Tenant",
	"description": "This is the dashboard client tenant",
	"oauth": {},
	"applications": [
		{
			"product": "CPROD",
			"package": "CPROD_MAIN",
			"appId": ObjectId('555214e9799d20bca477c1d9'),
			"description": "This application uses the Dashboard Main Package and gives access to example03 and example04.",
			"_TTL": 7 * 24 * 3600 * 1000, // 7 days hours
			"keys": [
				{
					"key": "65c69894cb9b4d2fe650042b0a5d3c16",
					"extKeys": [
						{
							"expDate": new Date().getTime() + 7 * 24 * 3600 * 1000, // + 7 days
							"extKey": "aa39b5490c4a4ed0e56d7ec1232a428f5a257e12b7fd03a25660e42c2c96ce7639dc1a86a968c83e5b40392a2c2e13a127b6a19d1b62595f2f2faa161bede3cd7cacfad3b44d44aafc062e0a07456e4a0fdaabff1fb4ffbf91434c6c8efe8d3f",
							"device": null,
							"geo": null
						}
					],
					"config": {
						"dev": {
							"example03":{
								"tenantName":"Dashboard Client Tenant"
							},
							"example04":{
								"tenantName":"Dashboard Client Tenant"
							}
						}
					}
				}
			]
		}
	]
};
