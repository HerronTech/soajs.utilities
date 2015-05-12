'use strict';

var product = {
	"_id": ObjectId("5551c7a9cd660df78867051e"),
	"locked": true,
	"code": "PROD",
	"name": "Test Product",
	"description": "This is a test product.",
	"packages": [
		{
			"code": "PROD_BASIC",
			"name": "Basic package",
			"locked": true,
			"description": "This package only allows access to urac and tenant get permissions.",
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