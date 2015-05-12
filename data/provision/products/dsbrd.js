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
			"_TTL": 86400000 // 24 hours
		}
	]
};