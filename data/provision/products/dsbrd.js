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
			"description": "This package is for the consumer.",
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
				},
				"dashboard": {
					"apisPermission": "restricted",
					"access": ["administrator"],
					"apis": {
						"/tenant/permissions/get":{},
						"tenant/application/acl/get":{},
						"/product/list":{},

						"/settings/tenant/get": {},
						"/settings/tenant/update": {},
						"/settings/tenant/oauth/list": {},
						"/settings/tenant/oauth/delete": {},
						"/settings/tenant/oauth/add": {},
						"/settings/tenant/oauth/update": {},
						"/settings/tenant/oauth/users/list": {},
						"/settings/tenant/oauth/users/add": {},
						"/settings/tenant/oauth/users/delete": {},
						"/settings/tenant/oauth/users/update": {},
						"/settings/tenant/application/list": {},
						"/settings/tenant/application/delete": {},
						"/settings/tenant/application/add": {},
						"/settings/tenant/application/update": {},
						"/settings/tenant/application/key/add": {},
						"/settings/tenant/application/key/delete": {},
						"/settings/tenant/application/key/list": {},
						"/settings/tenant/application/key/config/list": {},
						"/settings/tenant/application/key/config/update": {},
						"/settings/tenant/application/key/ext/add": {},
						"/settings/tenant/application/key/ext/delete": {},
						"/settings/tenant/application/key/ext/list": {},
						"/settings/tenant/application/key/ext/update": {}
					}
				}
			},
			"_TTL": 86400000 // 24 hours
		}
	]
};