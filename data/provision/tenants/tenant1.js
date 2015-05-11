'use strict';
var tenant1 = {
	"_id": ObjectId('54ee2150b7a669fc22b7f6b9'),
	"code": "TN1",
	"name": "Client 1",
	"description": "This is a test tenant client",
	"oauth": {
		"secret": "My secret phrase",
		"redirectURI": "http://domain.com",
		"grants": [
			"password",
			"refresh_token"
		]
	},
	"applications": [
		{
			"product": "PROD1",
			"package": "PROD1_PCK1",
			"appId": ObjectId('54ee2cee203674ba271d57a6'),
			"description": "Tenant 1 takes package 1",
			"_TTL": 7 * 24 * 3600 * 1000, // 7 days hours,
			"keys": [
				{
					"key": "19c03e42c750467c3f8481fbe26f2fef",
					"extKeys": [
						{
							"expDate": new Date().getTime() + 86400000,
							"extKey": "4232477ed993d167ec13ccf8836c29c400fef7eb3d175b1f2192b82ebef6fb2d129cdd25fe23c04f856157184e11f7f57b65759191908cb5c664df136c7ad16a56a5917fdeabfc97c92a1f199e457e31f2450a810769ff1b29269bcb3f01e3d2",
							"device": null,
							"geo": null
						}
					],
					"config": {
						"dev":{
							"urac": {
								"hashIterations": 1024, //used by hasher
								"seedLength": 32, //used by hasher
								"tokenExpiryTTL": 2 * 24 * 3600 * 1000
							},
							"example03": {
								"tenantName": "Client One"							
							},
							"example04": {
								"tenantName": "Client One"							
							}
						}	
					}
				}
			]
		}
	]
};