'use strict';
var client = {
	"_id": ObjectId("5552115ce179c39b760f7a1d"),
	"code": "DCTN",
	"name": "Dashboard Client Tenant",
	"description": "This is the dashboard client tenant",
	"oauth": {},
	"applications": [
		{
			"product": "DSBRD",
			"package": "DSBRD_CLIENT",
			"appId": ObjectId('555214e9799d20bca477c1d9'),
			"description": "This application uses the Dashboard Main Package and gives access to example03 and example04.",
			"keys": [
				{
					"key": "65c69894cb9b4d2fe650042b0a5d3c16",
					"extKeys": [
						{
							//key 3
							"extKey": "aa39b5490c4a4ed0e56d7ec1232a428f5a257e12b7fd03a25660e42c2c96ce7639dc1a86a968c83e5b40392a2c2e13a127b6a19d1b62595f2f2faa161bede3cd7cacfad3b44d44aafc062e0a07456e4a0fdaabff1fb4ffbf91434c6c8efe8d3f",
							"device": null,
							"geo": null
						}
					],
					"config": {
						"dev": {
                            "mail": {
                                "from": 'me@localhost.com',
                                "transport": {
                                    "type": "sendmail",
                                    "options": {}
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
                                        "subject": 'Welcome to SOAJS',
                                        "path": "/opt/soajs/node_modules/soajs.urac/mail/urac/join.tmpl"
                                    },
                                    "forgotPassword": {
                                        "subject": 'Reset Your Password at SOAJS',
                                        "path": "/opt/soajs/node_modules/soajs.urac/mail/urac/forgotPassword.tmpl"
                                    },
                                    "addUser": {
                                        "subject": 'Account Created at SOAJS',
                                        "path": "/opt/soajs/node_modules/soajs.urac/mail/urac/addUser.tmpl"
                                    },
                                    "changeUserStatus": {
                                        "subject": "Account Status changed at SOAJS",
                                        //use custom HTML
                                        "content": "<p>Dear <b>{{ username }}</b>, <br />The administrator update your account status to <b>{{ status }}</b> on {{ ts|date('F jS, Y') }}.<br /><br />Regards,<br/>SOAJS Team.</p>"
                                    },
                                    "changeEmail": {
                                        "subject": "Change Account Email at SOAJS",
                                        "path": "/opt/soajs/node_modules/soajs.urac/mail/urac/changeEmail.tmpl"
                                    }
                                }
                            }
						},
						"dashboard": {
							"mail": {
								"from": 'me@localhost.com',
								"transport": {
									"type": "sendmail",
									"options": {}
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
										"subject": 'Welcome to SOAJS',
										"path": "/opt/soajs/node_modules/soajs.urac/mail/urac/join.tmpl"
									},
									"forgotPassword": {
										"subject": 'Reset Your Password at SOAJS',
										"path": "/opt/soajs/node_modules/soajs.urac/mail/urac/forgotPassword.tmpl"
									},
									"addUser": {
										"subject": 'Account Created at SOAJS',
										"path": "/opt/soajs/node_modules/soajs.urac/mail/urac/addUser.tmpl"
									},
									"changeUserStatus": {
										"subject": "Account Status changed at SOAJS",
										//use custom HTML
										"content": "<p>Dear <b>{{ username }}</b>, <br />The administrator update your account status to <b>{{ status }}</b> on {{ ts|date('F jS, Y') }}.<br /><br />Regards,<br/>SOAJS Team.</p>"
									},
									"changeEmail": {
										"subject": "Change Account Email at SOAJS",
										"path": "/opt/soajs/node_modules/soajs.urac/mail/urac/changeEmail.tmpl"
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
