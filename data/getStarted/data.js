/***************************************************************
 *
 * DASHBOARD CORE_PROVISION
 *
 ***************************************************************/
var soajs = require("soajs");
var async = require("async");
var mongo = new soajs.mongo(dbconfig);
var keySecurity = "";

function addRecipes(cb){
	var catalogs = require('./provision/catalogs/');
	mongo.remove("catalogs", {"name": {"$in": ['Test Nginx Recipe', 'Test Service Recipe']}}, function (error) {
		if (error) {
			return cb(error);
		}
		
		mongo.insert("catalogs", catalogs, {upsert: true, multi: false, safe: true}, function (err, results) {
			if (err) {
				return cb(err);
			}
			
			console.log("Catalogs added");
			return cb();
		});
	});
}

function generateExternalKey(opts, cb) {
	var module = require("soajs").core.key;
	var key = opts.key;
	
	var tenant = {
		id: opts.tenantId
	};
	var application = {
		"package": opts.package
	};
	var config = {
		algorithm: "aes256",
		password: opts.secret.password
	};
	
	module.generateExternalKey(key, tenant, application, config, function (error, extKey) {
		if (error) {
			return cb(error);
		}
		
		module.getInfo(extKey, config, function (error, response) {
			if (error) {
				return cb(error);
			}
			if (response.key === key) {
				return cb(null, extKey);
			}
			else {
				return cb(new Error("Generated Key is invalid."))
			}
		});
	});
}

/*
 Services
 */
function addService(cb) {
	var example01 = require('./provision/services/example01');
	var example02 = require('./provision/services/example02');
	var example03 = require('./provision/services/example03');
	var example04 = require('./provision/services/example04');
	var helloworld = require('./provision/services/helloworld');
	
	
	var records = [example01, example02, example03, example04, helloworld];
	
	async.each(records, function (oneRecord, mcb) {
		oneRecord._id = new mongo.ObjectId(oneRecord._id);
		
		var condition = {
			"name": oneRecord.name
		};
		delete oneRecord.name;
		mongo.update("services", condition, {"$set": oneRecord}, {upsert: true, multi: false, safe: true}, mcb);
	}, cb);
}

function addEnv(cb) {
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
			test_env.services.config.cookie.secret = result.services.config.cookie.secret;
			test_env.services.config.session.secret = result.services.config.session.secret;
			keySecurity = result.services.config.key;
			delete test_env.code;
			mongo.update("environment", {"code": "TEST"}, {$set: test_env}, {
				upsert: true,
				multi: false,
				safe: true
			}, cb);
		}
		else {
			test_env.dbs.config.prefix = dbconfig.prefix;
			test_env.profile = __dirname + test_env.profile;
			keySecurity = result.services.config.key;
			delete test_env.code;
			mongo.update("environment", {"code": "TEST"}, {$set: test_env}, {
				upsert: true,
				multi: false,
				safe: true
			}, cb);
		}
	});
}

function addOauth(cb) {
	var oauth = require('./provision/oauth_urac/oauth_user_tenant1');
	var oauth2 = require('./provision/oauth_urac/oauthuser');
	var records = [oauth, oauth2];
	
	async.each(records, function (oneUser, mcb) {
		oneUser._id = new mongo.ObjectId(oneUser._id);
		oneUser.tId = new mongo.ObjectId(oneUser.tId);
		mongo.update("oauth_urac", {"userId": oneUser.userId}, {$set: oneUser}, {
			upsert: true,
			multi: false,
			safe: true
		}, mcb);
	}, cb);
}

function addProduct(cb) {
	var product1 = require('./provision/products/product1');
	var testProduct = require('./provision/products/testProduct');
	var records = [product1, testProduct];
	
	async.each(records, function (oneProduct, mcb) {
		oneProduct._id = new mongo.ObjectId(oneProduct._id);
		mongo.update("products", {"code": oneProduct.code}, {$set: oneProduct}, {
			upsert: true,
			multi: false,
			safe: true
		}, mcb);
	}, cb);
}

function addTenants(cb) {
	var tenant1 = require('./provision/tenants/tenant1');
	var tenant2 = require('./provision/tenants/tenant2');
	var tenant3 = require('./provision/tenants/tenant3');
	var test = require('./provision/tenants/test');
	var records = [tenant1, tenant2, tenant3, test];
	
	async.each(records, function (oneTenant, mcb) {
		oneTenant._id = new mongo.ObjectId(oneTenant._id);
		oneTenant.applications.forEach(function (oneApp) {
			oneApp.appId = new mongo.ObjectId(oneApp.appId.toString());
		});
		
		mongo.update("tenants", {"code": oneTenant.code}, {$set: oneTenant}, {
			upsert: true,
			multi: false,
			safe: true
		}, mcb);
	}, cb);
}

function addGit(cb) {
	var git = require('./provision/gitAccounts/soajsRepos');
	var condition = {
		"owner": git.owner,
		"provider": git.provider,
		"type": git.type,
		"access": git.access
	};
	mongo.findOne("git_accounts", condition, function (error, record) {
		if (error) {
			return cb(error);
		}
		if (!record) {
			mongo.insert('git_accounts', git, cb);
		}
		else {
			var list = [];
			git.repos.forEach(function (oneGitRepo) {
				
				var found = false;
				for (var i = 0; i < record.repos.length; i++) {
					if (oneGitRepo.type === record.repos[i].type && oneGitRepo.name === record.repos[i].name) {
						found = true;
						break;
					}
				}
				if (!found) {
					record.repos.push(oneGitRepo);
				}
				
			});
			mongo.save('git_accounts', record, cb);
		}
	});
}

function addUsers(opts, cb) {
	var mongo = opts.mongo;
	var user4 = require(opts.users.user1);
	var user5 = require(opts.users.user2);
	var user6 = require(opts.users.user3);
	
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
				"tenant.id": 1
			}
		},
		{
			"coll": "users",
			"index": {
				username: 1,
				"tenant.id": 1
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
		record._id = new mongo.ObjectId(record._id);
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
}

function modifyDashboardDefaults(cb) {
	mongo.findOne("products", {"code": "DSBRD", "locked": true}, function (error, dsbrdProduct) {
		if (error) {
			return cb(error);
		}
		
		dsbrdProduct.packages.forEach(function (onePackage) {
			if (onePackage.code === "DSBRD_OWNER") {
				if (!onePackage.acl.test) {
					onePackage.acl.test = {};
				}
				
			}
		});
		
		mongo.save("products", dsbrdProduct, function (error) {
			if (error) {
				return cb(error);
			}
			
			mongo.findOne("tenants", {"code": "DBTN", "locked": true}, function (error, dbtnTenant) {
				if (error) {
					return cb(error);
				}
				
				dbtnTenant.applications.forEach(function (oneApplication) {
					if (oneApplication.package == "DSBRD_OWNER") {
						oneApplication.keys.forEach(function (oneKey) {
							if (!oneKey.config.test) {
								oneKey.config.test = {};
							}
							
							generateExternalKey({
								key: oneKey.key,
								tenantId: dbtnTenant._id,
								package: oneApplication.package,
								secret: keySecurity
							}, function (error, externalKey) {
								if (error) {
									return cb(error);
								}
								
								for (var i = oneKey.extKeys.length - 1; i >= 0; i--) {
									if (oneKey.extKeys[i].env === 'DEV') {
										oneKey.extKeys.splice(i, 1);
									}
								}
								
								oneKey.extKeys.push({
									"extKey": externalKey,
									"device": {},
									"geo": {},
									"env": "TEST",
									"dashboardAccess": true
								});
								
								storeTenant(dbtnTenant);
							});
						});
					}
				});
			});
		});
	});
	
	function storeTenant(dbtnTenant) {
		mongo.save("tenants", dbtnTenant, cb);
	}
}

async.series([addRecipes, addService, addEnv, addOauth, addProduct, addTenants, addGit, modifyDashboardDefaults], function (error) {
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
		
		dbconfig.name = 'TNT1_urac';
		mongo = new soajs.mongo(dbconfig);
		
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
	