'use strict';

var tenant2 = {
	"_id": '54ee28cc203674ba271d57a4',
	"code": "TNT2",
	"name": "Client 2",
	"description": "This tenant is for client 2, and it uses Product One packages.",
	"oauth": {},
	"applications": [
		{
			"product": "PROD1",
			"package": "PROD1_PCK2",
			"appId": '54ee2d45203674ba271d57a7',
			"description": "This application uses Package Two from the Product One.",
			"keys": [
				{
					"key": "03738a730fb87e834c97c300fb922ddd",
					"extKeys": [
						{
							"extKey": "2423205b6ccd825aaa3dbf7f248f807996c1f39f4e128801107a10ea55eac9686f23b883b778b1763876fe47f7cc651fea232f7aa9dae3dfd1978d4948a3f26b948ebc1b71a9d6cacf08852312866d757b22392d8d3c0e28ee47edb0e7478157",
							"device": null,
							"geo": null,
							"env": "TEST"
						}
					],
					"config": {
						"test":{
							"urac": {
								"hashIterations": 1024, //used by hasher
								"seedLength": 32, //used by hasher
								"tokenExpiryTTL": 2 * 24 * 3600 * 1000,
								
							},
							"example03": {
								"tenantName":"Client Two"
							}
						}
					}
				},
				{
					"key": "9408d60576deb9191a20605bca4cdf4b",
					"extKeys": [
						{
							"extKey": "2423205b6ccd825aaa3dbf7f248f8079103601b9f8b272d331285c2db7f8aa9447a018572f63fb87c962076d7697ad8b7caeeaeafc5e6c05ab5d971cc5b4e238f05af11d9b9af75685739d7e838dc81eadabb0b4867bce48f99551ed0c92e1fd",
							"device": null,
							"geo": null,
							"env": "TEST"
						}
					],
					"config": {
						"test" :{
							"urac": {
								"hashIterations": 1024, //used by hasher
								"seedLength": 32, //used by hasher								
								"tokenExpiryTTL": 2 * 24 * 3600 * 1000,
								
							},
							"example03": {
							}
						}
					}
				}													
			]
		}
	]
};

module.exports = tenant2;