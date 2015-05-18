'use strict';

var dsbrdProduct = {
	"_id": ObjectId("5512867be603d7e01ab1688d"),
	"locked": true,
	"code": "DSBRD",
	"name": "Dashboard Product",
	"description": "This is the main dashboard product.",
	"packages": [
		{
			"code": "DSBRD_MAIN",
			"name": "Public Product Main Package",
			"locked": true,
			"description": "This package allows you to login to the dashboard.",
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
			"_TTL": 7 * 24 * 3600 * 1000 // 7 days hours
		},
		{
			"code": "DSBRD_OWNER",
			"name": "Dashboard Owner Package",
			"description": "This package provides full access to manage the dashboard and urac features.",
			"locked": true,
			"acl":{
				"urac": {
					"access": false,
					"apisRegExp": [
						{
							"regExp": /^\/account\/.+$/, //All APIs starting with /account/...
							"access": true
						},
						{
							"regExp": /^\/admin\/.+$/, //All APIs starting with /admin/...
							"access": ["owner"]
						}
					]
				},
				"dashboard": {
					"access": ["owner"],
					"apis": {
						"/tenant/permissions/get": {"access": true}
					}
				}
			},
			"_TTL": 7 * 24 * 3600 * 1000 // 7 days hours
		},
		{
			"code": "DSBRD_CLIENT",
			"name": "Dashboard Client Package",
			"description": "This package provides full the dashboard client members.",
			"locked": true,
			"acl":{
				"urac": {
					"apisPermission": "restricted",
					"access": false,
					"apis": {
						"/account/getUser": {"access": true},
						"/account/changePassword": {"access": true},
						"/account/editProfile": {"access": true},
						"/account/changeEmail": {"access": true},
						"/logout": {"access": true},

						"/admin/listUsers": {"access": ["client"]},
						"/admin/addUser": {"access": ["client"]},
						"/admin/getUser": {"access": ["client"]},
						"/admin/changeUserStatus": {"access": ["client"]},
						"/admin/editUser": {"access": ["client"]},
						"/admin/group/add": {"access": ["client"]},
						"/admin/group/addUsers": {"access": ["client"]},
						"/admin/group/delete": {"access": ["client"]},
						"/admin/group/edit": {"access": ["client"]},
						"/admin/group/list": {"access": ["client"]}
					}
				},
				"dashboard": {
					"apisPermission": "restricted",
					"access": ["client"],
					"apis": {
						"/tenant/acl/get": {
							"access": ["client"]
						},
						"/tenant/permissions/get": {
							"access": true
						},
						"/settings/tenant/get": {
							"access": ["client"]
						},
						"/settings/tenant/update": {
							"access": ["client"]
						},
						"/settings/tenant/oauth/list": {
							"access": ["client"]
						},
						"/settings/tenant/oauth/delete": {
							"access": ["client"]
						},
						"/settings/tenant/oauth/add": {
							"access": ["client"]
						},
						"/settings/tenant/oauth/update": {
							"access": ["client"]
						},
						"/settings/tenant/oauth/users/list": {
							"access": ["client"]
						},
						"/settings/tenant/oauth/users/add": {
							"access": ["client"]
						},
						"/settings/tenant/oauth/users/delete": {
							"access": ["client"]
						},
						"/settings/tenant/oauth/users/update": {
							"access": ["client"]
						},
						"/settings/tenant/application/list": {
							"access": ["client"]
						},
						"/settings/tenant/application/key/add": {
							"access": ["client"]
						},
						"/settings/tenant/application/key/delete": {
							"access": ["client"]
						},
						"/settings/tenant/application/key/list": {
							"access": ["client"]
						},
						"/settings/tenant/application/key/config/list": {
							"access": ["client"]
						},
						"/settings/tenant/application/key/config/update": {
							"access": ["client"]
						},
						"/settings/tenant/application/key/ext/add": {
							"access": ["client"]
						},
						"/settings/tenant/application/key/ext/delete": {
							"access": ["client"]
						},
						"/settings/tenant/application/key/ext/list": {
							"access": ["client"]
						},
						"/settings/tenant/application/key/ext/update": {
							"access": ["client"]
						}
					}
				}
			},
			"_TTL": 7 * 24 * 3600 * 1000 // 7 days hours
		}
	]
};