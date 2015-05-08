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
			"product": "DSBRD",
			"package": "DSBRD_CNSMR",
			"appId": ObjectId('554ce82a494d1deadc7c1655'),
			"description": "Application for Consumer",
			"_TTL": 7 * 24 * 3600 * 1000, // 7 days
			"keys": [
				{
					"key": "56987cc68f7160952b1c2b711390e9dd",
					"extKeys": [
						{
							"extKey": "4232477ed993d167ec13ccf8836c29c41e64958b82c553988dc203d1c6af8ec0f6f9a267ef3f182eee1e245fb456f10b1a9017d64074b6b9a88edd0f139024d7043d770ca6676f9dfa2032c2bc02429d4ecba32bc8b6497666408b02e5a3a27d",
							"device": {},
							"geo": {},
							"expDate": new Date().getTime() + 14 * 24 * 3600 * 1000, // + 14 days
						}
					],
					"config": {
						"dev": {
							"mail": {
								"from": 'me@localhost.com',
								"transport": {
									"type": "sendmail",
									"options": {
									}
								}
							},

							"urac": {
								"hashIterations": 1024, //used by hasher
								"seedLength": 32, //used by hasher
								"link": {
									"addUser": "http://dashboard.soajs.org/#/setNewPassword",
									"changeEmail": "http://dashboard.soajs.org/#/changeEmail/validate",
									"forgotPassword": "http://dashboard.soajs.org/#/resetPassword",
									"join": "http://dashboard.soajs.org/#/join/validate"
								},
								"tokenExpiryTTL": 2 * 24 * 3600 * 1000,// token expiry limit in seconds
								"validateJoin": true, //true if registration needs validation
								"mail": { //urac mail options
									"join": {
										"subject": 'Welcome to SOAJS'
									},
									"forgotPassword": {
										"subject": 'Reset Your Password at SOAJS'
									},
									"addUser": {
										"subject": 'Account Created at SOAJS'
									},
									"changeUserStatus": {
										"subject": "Account Status changed at SOAJS",
										//use custom HTML
										"content": "<p>Dear <b>{{ username }}</b>, <br />The administrator update your account status to <b>{{ status }}</b> on {{ ts|date('F jS, Y') }}.<br /><br />Regards,<br/>SOAJS Team.</p>"
									},
									"changeEmail": {
										"subject": "Change Account Email at SOAJS"
									}
								}
							}

						}
					}
				}
			]
		},
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
		},
		{
			"product": "PROD1",
			"package": "PROD1_PCK1",
			"appId": ObjectId('54ee376de950de122a6eb7b2'),
			"description": "This application will override the default ACL of the package to get example03",
			"_TTL": 7 * 24 * 3600 * 1000,
			"acl": {
				"urac": {},
				"example03": {},
				"example04": {}
			},
			"keys": [
				{
					"key": "41eb3256ce660a891205d0a0eca19421",
					"extKeys": [
						{
							"expDate": new Date().getTime() + 86400000,
							"extKey": "4232477ed993d167ec13ccf8836c29c4550e88551c880d36fd42223ef81e0a6e1f668d42edc70d3d98fa8d28757e951bd7a04cf43829b5c2f38ed8c9ee87f03b79e564dd6aeaf8c37e90c92e6a69dccbd52b5a7812cad139bfbeaab69b023322",
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
		},
		{
			"product": "PROD1",
			"package": "PROD1_PCK4",
			"appId": ObjectId('54f97a043d52cde7117559aa'),
			"description": "Tenant 1 takes package 4",
			"_TTL": 7 * 24 * 3600 * 1000,
			"keys": [
				{
					"key": "50026064e77e9eabf9e1328c14b22d46",
					"extKeys": [
						{
							"expDate": new Date().getTime() + 86400000,
							"extKey": "4232477ed993d167ec13ccf8836c29c4c3eabd8dc5d6b29af1725af616353c2ef59ab49a11f64affc60fa73a48eda79187085b064d533fb2f2adccf3e48b41088765a3665c91a193cf13808d68194ecc2061ae81639b49c9f1a73150a3123254",
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
							}
						}
						
					}
				}
			]
		}			
	]
};