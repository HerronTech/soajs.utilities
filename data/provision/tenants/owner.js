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
			"description": "This application uses the Dashboard Main Package.",
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
							},
							"dashboard": {
								"package": {
									"owner": {
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
										}
									},
									"consumer": {
										"acl": {
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
													"/tenant/application/acl/get": {
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
										}
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
