'use strict';
var dsbrd = {
	"_id": ObjectId("5551aca9e179c39b760f7a1a"),
	"locked": true,
	"code": "DBTN",
	"name": "Dashboard Tenant",
	"description": "this is the main dashboard tenant",
	"oauth": {},
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
														"access": ["root"]
													}
												]
											},
											"dashboard": {
												"access": ["root"],
												"apis": {
													"/tenant/permissions/get": {"access": true}
												}
											}
										}
									},
									"consumer": {
										"acl": {
											"urac": {
												"access": false,
												"apis": {
													"/admin/all": {"access": ['root']},
													"/account/getUser": {"access": true},
													"/account/changePassword": {"access": true},
													"/account/editProfile": {"access": true},
													"/account/changeEmail": {"access": true},

													"/admin/listUsers": {"access": ["administrator"]},
													"/admin/addUser": {"access": ["administrator"]},
													"/admin/getUser": {"access": ["administrator"]},
													"/admin/changeUserStatus": {"access": ["administrator"]},
													"/admin/editUser": {"access": ["administrator"]},
													"/admin/group/add": {"access": ["administrator"]},
													"/admin/group/addUsers": {"access": ["administrator"]},
													"/admin/group/delete": {"access": ["administrator"]},
													"/admin/group/edit": {"access": ["administrator"]},
													"/admin/group/list": {"access": ["administrator"]}
												}
											},
											"dashboard": {
												"apisPermission": "restricted",
												"access": ["administrator"],
												"apis": {
													"/tenant/application/acl/get": {
														"access": ["administrator"]
													},
													"/services/list": {
														"access": ["administrator"]
													},
													"/tenant/permissions/get": {
														"access": true
													},
													"/environment/list": {
														"access": ["administrator"]
													},
													"/settings/tenant/get": {
														"access": ["administrator"]
													},
													"/settings/tenant/update": {
														"access": ["administrator"]
													},
													"/settings/tenant/oauth/list": {
														"access": ["administrator"]
													},
													"/settings/tenant/oauth/delete": {
														"access": ["administrator"]
													},
													"/settings/tenant/oauth/add": {
														"access": ["administrator"]
													},
													"/settings/tenant/oauth/update": {
														"access": ["administrator"]
													},
													"/settings/tenant/oauth/users/list": {
														"access": ["administrator"]
													},
													"/settings/tenant/oauth/users/add": {
														"access": ["administrator"]
													},
													"/settings/tenant/oauth/users/delete": {
														"access": ["administrator"]
													},
													"/settings/tenant/oauth/users/update": {
														"access": ["administrator"]
													},
													"/settings/tenant/application/list": {
														"access": ["administrator"]
													},
													"/settings/tenant/application/key/add": {
														"access": ["administrator"]
													},
													"/settings/tenant/application/key/delete": {
														"access": ["administrator"]
													},
													"/settings/tenant/application/key/list": {
														"access": ["administrator"]
													},
													"/settings/tenant/application/key/config/list": {
														"access": ["administrator"]
													},
													"/settings/tenant/application/key/config/update": {
														"access": ["administrator"]
													},
													"/settings/tenant/application/key/ext/add": {
														"access": ["administrator"]
													},
													"/settings/tenant/application/key/ext/delete": {
														"access": ["administrator"]
													},
													"/settings/tenant/application/key/ext/list": {
														"access": ["administrator"]
													},
													"/settings/tenant/application/key/ext/update": {
														"access": ["administrator"]
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
