'use strict';
var admin = {
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
			"package": "DSBRD_CNSMR",
			"appId": ObjectId('55507663168ebe460e0ec5a0'),
			"description": "This is an application for the consumer",
			"_TTL": 7 * 24 * 3600 * 1000,
			"keys": [
				{
					"key": "fe195c14c3434d1ac1967ddb77ba2273",
					"extKeys": [
						{
							"extKey": "9b96ba56ce934ded56c3f21ac9bdaddca4b47f86460bef85fa4d4a2244b72e127addcffd5eb130667fef1b4055943b4f63c1df2462088e4cc4e7bf417f86e955f721bd87b32cf0ff1a7e173d679d95f91a490c6777c83e1c2cf6453ea5b85e3a",
							"device": {},
							"geo": {},
							"expDate": new Date().getTime() + 7 * 24 * 3600 * 1000 // + 7 days
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
			"product": "PROD",
			"package": "PROD_BASIC",
			"appId": ObjectId('5551c815cd660df78867051f'),
			"description": "This is an application for the consumer",
			"_TTL": 7 * 24 * 3600 * 1000,
			"keys": [
				{
					"key": "fe195c14c3434d1ac1967ddb77ba2273",
					"extKeys": [
						{
							"extKey": "9b96ba56ce934ded56c3f21ac9bdaddca4b47f86460bef85fa4d4a2244b72e127addcffd5eb130667fef1b4055943b4f63c1df2462088e4cc4e7bf417f86e955f721bd87b32cf0ff1a7e173d679d95f91a490c6777c83e1c2cf6453ea5b85e3a",
							"device": {},
							"geo": {},
							"expDate": new Date().getTime() + 7 * 24 * 3600 * 1000 // + 7 days
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
		}
	]
};