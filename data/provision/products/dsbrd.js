'use strict';

var dsbrdProduct = {
	"_id": ObjectId("5512867be603d7e01ab1688d"),
	"locked": true,
	"code": "DSBRD",
	"name": "Main Product",
	"description": "This is the main dashboard product.",
	"packages": [
		{
			"code": "DSBRD_DEFLT",
			"name": "Main package",
			"locked": true,
			"description": "This is the main dashboard product package.",
			"acl": {
				"urac": {
					"access": false,
					"apis": {
						"/admin/all":{
							"access": ['root']
						}
					},
					"apisRegExp": [
						{
							"regExp": /^\/account\/.+$/, //All APIs starting with /account/...
							"access": true
						},
						{
							"regExp": /^\/admin\/.+$/, //All APIs starting with /admin/...
							"access": ["administrator"]
						}
					]
					//"account.." :[access : true],
					//"admin..." : [ access: admin]
				},
				"dashboard": {
					"access": ["administrator"]
				}
			},
			"_TTL": 86400000 // 24 hours
		},
		{
			"code": "DSBRD_CNSMR",
			"name": "Consumer package",
			"locked": true,
			"description": "This package is for the consumer.",
			"acl": {
				"urac": {
					"access": false,
					"apis": {},
					"apisRegExp": [
						{
							"regExp": /^\/account\/.+$/, //All APIs starting with /account/...
							"access": true
						},
						{
							"regExp": /^\/admin\/.+$/, //All APIs starting with /admin/...
							"access": ["administrator"]
						}
					]
				},
				"dashboard": {
					"access": ["administrator"]
				}
			},
			"_TTL": 86400000 // 24 hours
		}
	]
};