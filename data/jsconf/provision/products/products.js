var products = [
	{
		"_id": ObjectId('5711fedf1ebf34041c0b0624'),
		"code": "PRODA",
		"name": "Product A",
		"description": "This Product provides ACL to JSConf Services.",
		"packages": [
			{
				"code": "PRODA_BASIC",
				"name": "Basic",
				"description": "This Package grants access to hello world APIs only.",
				"acl": {
					"dev": {
						"jsconf3": {
							"apis": {
								"/hello": {}
							},
							"access": false,
							"apisPermission": "restricted"
						},
						"jsconf2": {
							"apis": {
								"/hello": {}
							},
							"access": false,
							"apisPermission": "restricted"
						},
						"jsconf4": {
							"apis": {
								"/hybrid": {}
							},
							"access": false,
							"apisPermission": "restricted"
						}
					}
				},
				"_TTL": 21600000
			},
			{
				"code": "PRODA_GOLD",
				"name": "Gold",
				"description": "This Package grants access to all APIs",
				"acl": {
					"dev": {
						"jsconf2": {
							"apis": {},
							"access": false
						},
						"jsconf3": {
							"apis": {},
							"access": false
						},
						"jsconf4": {
							"apis": {},
							"access": false
						},
						"oauth": {
							"access": false
						}
					}
				},
				"_TTL": 21600000
			}
		]
	},
	{
		"_id": ObjectId('5512867be603d7e01ab1688d'),
		"locked": true,
		"code": "DSBRD",
		"name": "Dashboard Product",
		"description": "This is the main dashboard product.",
		"packages": [
			{
				"code": "DSBRD_MAIN",
				"name": "Main Product Dashboard Package",
				"locked": true,
				"description": "This package allows you to login to the dashboard.",
				"acl": {
					"dashboard": {
						"dashboard": {
							"apisPermission": "restricted",
							"apis": {
								"/key/get": {
									"access": true
								},
								"/permissions/get": {
									"access": true
								},
								"/tenant/acl/get": {
									"access": true
								}
							}
						},
						"urac": {
							"apisPermission": "restricted",
							"access": false,
							"apis": {
								"/login": {},
								"/forgotPassword": {},
								"/changeEmail/validate": {},
								"/join": {},
								"/join/validate": {},
								"/resetPassword": {},
								"/logout": {
									"access": true
								}
							}
						}
					}
				},
				"_TTL": 604800000
			},
			{
				"code": "DSBRD_OWNER",
				"name": "Dashboard Owner Package",
				"description": "This package provides full access to manage the dashboard and urac features.",
				"locked": true,
				"acl": {
					"dashboard": {
						"urac": {
							"access": [
								"owner"
							]
						},
						"dashboard": {
							"access": [
								"owner"
							]
						},
						"proxy": {
							"access": [
								"owner"
							]
						}
					},
					"dev": {
						"gc_articles": {
							"access": [
								"owner"
							]
						}
					}
				},
				"_TTL": 604800000
			},
			{
				"code": "DSBRD_CLIENT",
				"name": "Main Client Product Package",
				"description": "This package offers both example03 and example04",
				"acl": {
					"dev": {
						"gc_articles": {
							"access": true
						}
					},
					"dashboard": {
						"urac": {
							"apis": {
								"/account/getUser": {
									"access": true
								},
								"/account/changePassword": {
									"access": true
								},
								"/account/editProfile": {
									"access": true
								},
								"/account/changeEmail": {
									"access": true
								},
								"/logout": {
									"access": true
								},
								"/changeEmail/validate": {
									"access": true
								},
								"/admin/getUser": {
									"access": [
										"administrator"
									]
								},
								"/admin/listUsers": {
									"access": [
										"administrator"
									]
								},
								"/admin/addUser": {
									"access": [
										"administrator"
									]
								},
								"/admin/changeUserStatus": {
									"access": [
										"administrator"
									]
								},
								"/admin/editUser": {
									"access": [
										"administrator"
									]
								},
								"/admin/group/add": {
									"access": [
										"administrator"
									]
								},
								"/admin/group/addUsers": {
									"access": [
										"administrator"
									]
								},
								"/admin/group/delete": {
									"access": [
										"administrator"
									]
								},
								"/admin/group/edit": {
									"access": [
										"administrator"
									]
								},
								"/admin/group/list": {
									"access": [
										"administrator"
									]
								}
							},
							"access": false,
							"apisPermission": "restricted"
						},
						"dashboard": {
							"apis": {
								"/tenant/acl/get": {
									"access": [
										"administrator"
									]
								},
								"/tenant/db/keys/list": {
									"access": [
										"administrator"
									]
								},
								"/logout": {
									"access": true
								},
								"/key/get": {
									"access": true
								},
								"/permissions/get": {
									"access": true
								},
								"/settings/tenant/get": {
									"access": [
										"administrator"
									]
								},
								"/product/packages/get": {
									"access": [
										"administrator"
									]
								},
								"/settings/tenant/update": {
									"access": [
										"administrator"
									]
								},
								"/settings/tenant/oauth/list": {
									"access": [
										"administrator"
									]
								},
								"/settings/tenant/oauth/delete": {
									"access": [
										"administrator"
									]
								},
								"/settings/tenant/oauth/add": {
									"access": [
										"administrator"
									]
								},
								"/settings/tenant/oauth/update": {
									"access": [
										"administrator"
									]
								},
								"/settings/tenant/oauth/users/list": {
									"access": [
										"administrator"
									]
								},
								"/settings/tenant/oauth/users/add": {
									"access": [
										"administrator"
									]
								},
								"/settings/tenant/oauth/users/delete": {
									"access": [
										"administrator"
									]
								},
								"/settings/tenant/oauth/users/update": {
									"access": [
										"administrator"
									]
								},
								"/settings/tenant/application/list": {
									"access": [
										"administrator"
									]
								},
								"/settings/tenant/application/key/add": {
									"access": [
										"administrator"
									]
								},
								"/settings/tenant/application/key/delete": {
									"access": [
										"administrator"
									]
								},
								"/settings/tenant/application/key/list": {
									"access": [
										"administrator"
									]
								},
								"/settings/tenant/application/key/config/list": {
									"access": [
										"administrator"
									]
								},
								"/settings/tenant/application/key/config/update": {
									"access": [
										"administrator"
									]
								},
								"/settings/tenant/application/key/ext/add": {
									"access": [
										"administrator"
									]
								},
								"/settings/tenant/application/key/ext/delete": {
									"access": [
										"administrator"
									]
								},
								"/settings/tenant/application/key/ext/list": {
									"access": [
										"administrator"
									]
								},
								"/settings/tenant/application/key/ext/update": {
									"access": [
										"administrator"
									]
								},
								"/cb/list": {
									"access": [
										"administrator"
									]
								}
							},
							"access": [
								"administrator"
							],
							"apisPermission": "restricted"
						},
						"proxy": {
							"apis": {},
							"access": [
								"administrator"
							]
						}
					}
				},
				"_TTL": 86400000
			}
		]
	}
];