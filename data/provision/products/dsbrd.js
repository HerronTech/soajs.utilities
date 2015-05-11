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
			"name": "Default package",
			"locked": true,
			"description": "This is the main dashboard product package.",
			"acl": {
				"dashboard": {
					"apisPermission": "restricted",
					"apis": {
						"/tenant/permissions/get": {}
					}
				},
				"urac": {
					"access": false,
					"apis": {
						"/login": {},
						"/forgotPassword": {},
						"/changeEmail/validate": {},
						"/join": {},
						"/logout": {},
						"/join/validate": {},
						"/resetPassword": {},
						"/account/getUser": {"access": true},
						"/account/changePassword": {"access": true},
						"/account/editProfile": {"access": true},
						"/account/changeEmail": {"access": true}
					},
					"apisPermission": "restricted"
				}
			},
			"_TTL": 86400000 // 24 hours
		},
		{
			"code": "DSBRD_OWNER",
			"name": "Owner package",
			"description": "This is the package used by the owner.",
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
							"access": ["root"]
						}
					]
				},
				"dashboard": {
					"access": ["root"],
					"apis":{
						"/tenant/permissions/get":{
							"access": true
						}
					}
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
					"apis":{
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
						"/tenant/permissions/get":{
							"access": true
						},
						"tenant/application/acl/get":{
							"access": true
						},
						"/environment/list":{},

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