'use strict';
var DbTenant = {
	"_id": ObjectId("551286bce603d7e01ab1688e"), 
	"locked" : true, 	
	"code": "DBTN",
	"name": "Dashboard Tenant",
	"description": "this is the main dashboard tenant",
	"oauth":{},
	"applications": [
		{
			"product": "DSBRD",
			"package": "DSBRD_DEFLT",
			"appId": ObjectId('5512926a7a1f0e2123f638de'),
			"description": "This is the main application for the dashboard tenant",
			"_TTL": 7 * 24 * 3600 * 1000, // 7 days hours
			"keys": [
				{
					"key": "38145c67717c73d3febd16df38abf311",
					"extKeys": [
						{
							"expDate": new Date().getTime() + 7 * 24 * 3600 * 1000, // + 7 days
							"extKey": "9b96ba56ce934ded56c3f21ac9bdaddc8ba4782b7753cf07576bfabcace8632eba1749ff1187239ef1f56dd74377aa1e5d0a1113de2ed18368af4b808ad245bc7da986e101caddb7b75992b14d6a866db884ea8aee5ab02786886ecf9f25e974",
							"device": null,
							"geo": null
						}
					],
					"config": {
						"dev":{
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
			"product": "DSBRD",
			"package": "DSBRD_OWNER",
			"appId": ObjectId('5550b473373137a130ebbb68'),
			"description": "This application is for the owner",
			"_TTL":  7 * 24 * 3600 * 1000,
			"keys": [
				{
					"key": "36d4374268b3afbf12da8174bad8d1d5",
					"extKeys": [
						{
							"extKey": "9b96ba56ce934ded56c3f21ac9bdaddce180a1b2bb71f5d20112c2895624a2661f9d5daa8d8d03b489b6f8055f6cf5e94166e8e4479401bd2a92e5ed8db02ddf62505479bb8728fac61b72f4c25799167c64e03718dd1b7e547e866b1ab15da4",
							"device": {},
							"geo": {},
							"expDate": new Date().getTime() + 7 * 24 * 3600 * 1000,
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
							"expDate": new Date().getTime() + 7 * 24 * 3600 * 1000, // + 7 days
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
