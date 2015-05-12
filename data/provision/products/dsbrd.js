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
						"/tenant/permissions/get": { "access": true }
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
						"/tenant/permissions/get":{ "access": true }
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
						"/environment/list":{
							"access": ["administrator"]
						},
						"/settings/tenant/get": {
							"access": ["administrator"]
						},
						"/settings/tenant/update": {
							"access": ["administrator"]
						},
						"/settings/tenant/oauth/list": {
							"access": ["administrator"]
						},
						"/settings/tenant/oauth/delete": {
							"access": ["administrator"]
						},
						"/settings/tenant/oauth/add": {
							"access": ["administrator"]
						},
						"/settings/tenant/oauth/update": {
							"access": ["administrator"]
						},
						"/settings/tenant/oauth/users/list": {
							"access": ["administrator"]
						},
						"/settings/tenant/oauth/users/add": {
							"access": ["administrator"]
						},
						"/settings/tenant/oauth/users/delete": {
							"access": ["administrator"]
						},
						"/settings/tenant/oauth/users/update": {
							"access": ["administrator"]
						},
						"/settings/tenant/application/list": {
							"access": ["administrator"]
						},

						"/settings/tenant/application/key/add": {
							"access": ["administrator"]
						},
						"/settings/tenant/application/key/delete": {
							"access": ["administrator"]
						},
						"/settings/tenant/application/key/list": {
							"access": ["administrator"]
						},
						"/settings/tenant/application/key/config/list": {
							"access": ["administrator"]
						},
						"/settings/tenant/application/key/config/update": {
							"access": ["administrator"]
						},
						"/settings/tenant/application/key/ext/add": {
							"access": ["administrator"]
						},
						"/settings/tenant/application/key/ext/delete": {
							"access": ["administrator"]
						},
						"/settings/tenant/application/key/ext/list": {
							"access": ["administrator"]
						},
						"/settings/tenant/application/key/ext/update": {
							"access": ["administrator"]
						}
					}
				}
			},
			"_TTL": 86400000 // 24 hours
		}
	]
};