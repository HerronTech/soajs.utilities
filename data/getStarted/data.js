/***************************************************************
 *
 * DASHBOARD CORE_PROVISION
 *
 ***************************************************************/
var soajs = require("soajs");
var async = require("async");
var mongo = new soajs.mongo(dbconfig);

var addEnv = function (cb) {
	var test_env = require('./provision/environments/test.js');
	
	mongo.findOne("environment", {"code": "DASHBOARD"}, function (err, result) {
		if (err) {
			return cb(err);
		}
		if (result) {
			test_env.profile = result.profile;
			test_env.deployer = result.deployer;
			test_env.dbs.clusters.test_cluster = result.dbs.clusters.dash_cluster;
			test_env.dbs.config.prefix = dbconfig.prefix;
			test_env.services.config.cookie.secret = result.config.cookie.secret;
			test_env.services.config.session.secret = result.config.session.secret;
			delete test_env.code;
			mongo.update("environment", {"code": "TEST"}, {$set: test_env}, {
				upsert: true,
				multi: false,
				safe: true
			}, cb);
		}
		else {
			test_env.dbs.config.prefix = dbconfig.prefix;
			delete test_env.code;
			mongo.update("environment", {"code": "TEST"}, {$set: test_env}, {
				upsert: true,
				multi: false,
				safe: true
			}, cb);
		}
	});
};

var addOauth = function (cb) {
	var oauth = require('./provision/oauth_urac/oauth_user_tenant1');
	var oauth2 = require('./provision/oauth_urac/oauthuser');
	
	oauth._id = new mongo.ObjectId(oauth._id);
	oauth2._id = new mongo.ObjectId(oauth2._id);
	
	oauth.tId = new mongo.ObjectId(oauth.tId);
	oauth2.tId = new mongo.ObjectId(oauth2.tId);
	
	records = [];
	records.push(oauth);
	records.push(oauth2);
	mongo.update("oauth_urac", {"userId": "oauthuser_tenant1"}, {$set: records[0]}, {
		upsert: true,
		multi: false,
		safe: true
	}, function (err, res) {
		if (err) {
			return cb(err);
		}
		
		mongo.update("oauth_urac", {"userId": "oauthuser"}, {$set: records[1]}, {
			upsert: true,
			multi: false,
			safe: true
		}, cb)
	});
};

var addProduct = function (cb) {
	var product1 = require('./provision/products/product1');
	var testProduct = require('./provision/products/testProduct');
	
	product1._id = new mongo.ObjectId(product1._id);
	testProduct._id = new mongo.ObjectId(testProduct._id);
	
	records = [];
	records.push(product1);
	records.push(testProduct);
	mongo.update("products", {"code": "PROD1"}, {$set: records[0]}, {
		upsert: true,
		multi: false,
		safe: true
	}, function (err, res) {
		if (err) {
			return cb(err);
		}
		
		mongo.update("products", {"code": "TRPOD"}, {$set: records[1]}, {upsert: true, multi: false, safe: true}, cb)
	});
};

var addTenants = function (cb) {
	var tenant1 = require('./provision/tenants/tenant1');
	var tenant2 = require('./provision/tenants/tenant2');
	var tenant3 = require('./provision/tenants/tenant3');
	var test = require('./provision/tenants/test');
	
	tenant1._id = new mongo.ObjectId(tenant1._id);
	tenant2._id = new mongo.ObjectId(tenant2._id);
	tenant3._id = new mongo.ObjectId(tenant3._id);
	test._id = new mongo.ObjectId(test._id);
	
	tenant1.applications.forEach(function (oneApp) {
		oneApp.appId = new mongo.ObjectId(oneApp.appId.toString());
	});
	
	tenant2.applications.forEach(function (oneApp) {
		oneApp.appId = new mongo.ObjectId(oneApp.appId.toString());
	});
	
	tenant3.applications.forEach(function (oneApp) {
		oneApp.appId = new mongo.ObjectId(oneApp.appId.toString());
	});
	
	test.applications.forEach(function (oneApp) {
		oneApp.appId = new mongo.ObjectId(oneApp.appId.toString());
	});
	
	var records = [];
	records.push(tenant1);
	records.push(tenant2);
	records.push(tenant3);
	records.push(test);
	
	mongo.update("tenants", {"code": "TNT1"}, {$set: records[0]}, {
		upsert: true,
		multi: false,
		safe: true
	}, function (err1, res1) {
		if (err1) {
			return cb(err1);
		}
		
		mongo.update("tenants", {"code": "TNT2"}, {$set: records[1]}, {
			upsert: true,
			multi: false,
			safe: true
		}, function (err2, res2) {
			if (err2) {
				return cb(err2);
			}
			mongo.update("tenants", {"code": "TNT3"}, {$set: records[2]}, {
				upsert: true,
				multi: false,
				safe: true
			}, function (err3, res3) {
				if (err3) {
					return cb(err3)
				}
				mongo.update("tenants", {"code": "test"}, {$set: records[3]}, {
					upsert: true,
					multi: false,
					safe: true
				}, cb)
			});
		});
	});
};

var addGit = function (cb) {
	var git = require('./provision/gitAccounts/soajsRepos');
	mongo.update("git_accounts", {"code": "TEST"}, {$set: git}, {upsert: true, multi: false, safe: true}, cb);
};

var addUsers = function (opts, cb) {
	var mongo = opts.mongo;
	var user4 = require(opts.users.user1);
	var user5 = require(opts.users.user2);
	var user6 = require(opts.users.user3);
	
	user4._id = new mongo.ObjectId(user4._id);
	user5._id = new mongo.ObjectId(user5._id);
	user6._id = new mongo.ObjectId(user6._id);
	
	var records = [user4, user5, user6];
	var indexes = [
		{
			"coll": "users",
			"index": {
				username: 1
			},
			"unique": true
		},
		{
			"coll": "users",
			"index": {
				email: 1
			},
			"unique": true
		},
		{
			"coll": "users",
			"index": {
				username: 1
			},
			"unique": true
		},
		{
			"coll": "users",
			"index": {
				email: 1
			},
			"unique": true
		},
		{
			"coll": "users",
			"index": {
				username: 1,
				status: 1
			}
		},
		{
			"coll": "users",
			"index": {
				email: 1,
				"status": 1
			}
		},
		{
			"coll": "users",
			"index": {
				groups: 1,
				"tenant.id": true
			}
		},
		{
			"coll": "users",
			"index": {
				username: 1,
				"tenant.id": true
			}
		},
		{
			"coll": "users",
			"index": {
				status: 1
			}
		},
		{
			"coll": "users",
			"index": {
				locked: 1
			}
		},
		{
			"coll": "users",
			"index": {
				"tenant.id": 1
			}
		},
		{
			"coll": "users",
			"index": {
				_id: 1,
				"status": 1
			}
		},
		{
			"coll": "users",
			"index": {
				_id: 1,
				"locked": 1
			}
		},
		{
			"coll": "groups",
			"index": {
				"tenant.id": 1,
				"code": 1
			}
		},
		{
			"coll": "groups",
			"index": {
				"tenant.id": 1
			}
		},
		{
			"coll": "groups",
			"index": {
				locked: 1
			}
		},
		{
			"coll": "groups",
			"index": {
				code: 1,
				"tenant": 1
			}
		},
		{
			"coll": "tokens",
			"index": {
				token: 1
			},
			"unique": true
		},
		{
			"coll": "tokens",
			"index": {
				userId: 1,
				service: 1,
				status: 1
			}
		},
		{
			"coll": "tokens",
			"index": {
				token: 1,
				service: 1,
				status: 1
			}
		}
	];
	
	async.mapSeries(indexes, ensureIndex, function (error) {
		if (error) {
			return cb(error);
		}
		async.mapSeries(records, updateUser, cb);
	});
	
	
	function updateUser(record, mcb) {
		mongo.update("users", {"username": record.username}, {$set: record}, {
			upsert: true,
			multi: false,
			safe: true
		}, mcb);
	}
	
	function ensureIndex(oneObj, mcb) {
		if (oneObj.unique) {
			mongo.ensureIndex(oneObj.coll, oneObj.index, {unique: true}, mcb);
		}
		else {
			mongo.ensureIndex(oneObj.coll, oneObj.index, mcb);
		}
	}
};

addEnv(function (error) {
	if (error) {
		throw error;
	}
	
	addOauth(function (error) {
		if (error) {
			throw error;
		}
		
		addProduct(function (error) {
			if (error) {
				throw error;
			}
			
			addTenants(function (error) {
				if (error) {
					throw error;
				}
				
				addGit(function (error) {
					if (error) {
						throw error;
					}
					
					mongo.closeDb();
					var dbconfig2 = dbconfig;
					dbconfig2.name = 'test_urac';
					mongo = new soajs.mongo(dbconfig2);
					
					var opts = {
						"mongo": mongo,
						"users": {
							"user1": "./urac/users/user4",
							"user2": "./urac/users/user5",
							"user3": "./urac/users/user6"
						}
					};
					
					addUsers(opts, function (error) {
						if (error) {
							throw error;
						}
						mongo.closeDb();
						var dbconfig3 = dbconfig;
						dbconfig3.name = 'TNT1_urac';
						mongo = new soajs.mongo(dbconfig3);
						
						var opts = {
							"mongo": mongo,
							"users": {
								"user1": "./urac/users/user1",
								"user2": "./urac/users/user2",
								"user3": "./urac/users/user3"
							}
						};
						addUsers(opts, function (error) {
							if (error) {
								throw error;
							}
							
							console.log("done");
							process.exit();
						});
					});
				});
			});
		});
	});
});
	