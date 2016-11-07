'use strict';
var dsbrd = {
	"_id": ObjectId("5551aca9e179c39b760f7a1a"),
	"locked": true,
	"code": "DBTN",
	"name": "Dashboard Owner Tenant",
	"description": "this is the main dashboard tenant",
	"oauth": {},
	"applications": [
		{
			"product": "DSBRD",
			"package": "DSBRD_MAIN",
			"appId": ObjectId('5512926a7a1f0e2123f638de'),
			"description": "This application uses the Dashboard Public Package.",
			"keys": [
				{
					"key": "38145c67717c73d3febd16df38abf311",
					"extKeys": [
						{
							//key 1
							"extKey": "9b96ba56ce934ded56c3f21ac9bdaddc8ba4782b7753cf07576bfabcace8632eba1749ff1187239ef1f56dd74377aa1e5d0a1113de2ed18368af4b808ad245bc7da986e101caddb7b75992b14d6a866db884ea8aee5ab02786886ecf9f25e974",
							"device": null,
							"geo": null,
							"env": "DASHBOARD"
						},
						{
							//key 2
							"extKey": "9b96ba56ce934ded56c3f21ac9bdaddc8ba4782b7753cf07576bfabcace8632eba1749ff1187239ef1f56dd74377aa1e5d0a1113de2ed18368af4b808ad245bc7da986e101caddb7b75992b14d6a866db884ea8aee5ab02786886ecf9f25e974",
							"device": null,
							"geo": null,
							"env": "DEV"
						}
					],
					"config": {
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
						},
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
						}
					}
				}
			]
		},
        {
            "product": "DSBRD",
            "package": "DSBRD_OWNER",
            "appId": ObjectId('55cc56a3c3aca9179e5048e6'),
            "description": "This application uses the Dashboard Owner Package.",
            "keys": [
                {
                    "key": "9ccfb3cdaf5f61cf0cff5c78215b2292",
                    "extKeys": [
                        {
	                        "env": "DASHBOARD",
                            "extKey": "cc9390e7b7bb0a360c899aa904382def1e7cbc8886fe43c89b5541fc6ad1ec9f0dff78e327f9007c718864d7ce71076ac07223a1c59c0d180a4520200917fe9c84917cf63f1579fb66fa60c661e62e293516d0ef95eb24095d366511d2335a8d",
                            "device": null,
                            "geo": null
                        },
	                    {
		                    "env": "DEV",
		                    "extKey": "cc9390e7b7bb0a360c899aa904382def1e7cbc8886fe43c89b5541fc6ad1ec9f0dff78e327f9007c718864d7ce71076ac07223a1c59c0d180a4520200917fe9c84917cf63f1579fb66fa60c661e62e293516d0ef95eb24095d366511d2335a8d",
		                    "device": null,
		                    "geo": null
	                    }
                    ],
                    "config": {
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
                        },
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
                        }
                    }
                }
            ]
        }
	]
};
