'use strict';
var tenant1 = {
	"_id": ObjectId('54ee2150b7a669fc22b7f6b9'),
	"code": "TNT1",
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
			"product": "DSBRD",
			"package": "DSBRD_DEFLT",
			"appId": ObjectId('5551f1248380bbaa960b408a'),
			"description": "default package for administrator group.",
			"_TTL": 604800000,
			"keys": [
				{
					"key": "5c6159e1d9e7443b72a772b42a06f35b",
					"extKeys": [
						{
							"extKey": "4232477ed993d167ec13ccf8836c29c4419dc3d562c57d36305d85373f31ecdb2110c05936280ad9a177823ed86aa9bb0eacbb84bb09dfbd8ef27dad36883c8644656089ead7ad7728ed6deec341e8c8791331b7314855958a239b63674eaf50",
							"device": {},
							"geo": {}
						}
					],
					"config": {}
				}
			]
		}
	]
};