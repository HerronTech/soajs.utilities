'use strict';
var root = {
	"_id": ObjectId("551286bce603d7e01ab1688e"), 
	"locked" : true, 	
	"code": "ROOT",
	"name": "Dashboard Root Tenant",
	"description": "this is the root dashboard tenant",
	"oauth":{},
	"applications": [
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
							"expDate": new Date().getTime() + 7 * 24 * 3600 * 1000
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
