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

function addService(cb) {
	var jsconf1 = require('./provision/services/jsconf1');
	var jsconf2 = require('./provision/services/jsconf2');
	var jsconf3 = require('./provision/services/jsconf3');
	var jsconf4 = require('./provision/services/jsconf4');
	
	var records = [jsconf1, jsconf2, jsconf3, jsconf4];
	
	async.each(records, function (oneRecord, mcb) {
		oneRecord._id = new mongo.ObjectId(oneRecord._id);
		
		var condition = {
			"name": oneRecord.name
		};
		delete oneRecord.name;
		mongo.update("services", condition, {"$set": oneRecord}, {upsert: true, multi: false, safe: true}, mcb);
	}, cb);
}

function addProducts(cb) {
	var products = require('./provision/products/products.js');
	mongo.update("products", {"code": "PRODA"}, {$set: products}, {upsert: true, multi: false, safe: true}, cb);
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

function addOauth(cb) {
	var oauth = require('./provision/oauth_urac/users.js');
	oauth._id = new mongo.ObjectId(oauth._id);
	oauth.tId = new mongo.ObjectId(oauth.tId);
	mongo.update("oauth_urac", {"userId": oauth.userId}, {$set: oauth}, {upsert: true, multi: false, safe: true}, cb)
}

function addTenants(cb) {
	var tenants = require('./provision/tenants/tenants.js');
	
	tenants.forEach(function (oneTenant) {
		oneTenant._id = new mongo.ObjectId(oneTenant._id.toString());
		
		oneTenant.applications.forEach(function (oneApp) {
			oneApp.appId = new mongo.ObjectId(oneApp.appId.toString());
		});
	});
	
	mongo.update("tenants", {"code": "JST2"}, {$set: tenants[0]}, {
		upsert: true,
		multi: false,
		safe: true
	}, function (err1) {
		if (err1) {
			return cb(err1);
		}
		else {
			mongo.update("tenants", {"code": "JSTE"}, {$set: tenants[1]}, {
				upsert: true,
				multi: false,
				safe: true
			}, function (err2) {
				if (err2) {
					return cb(err2);
				}
				else {
					mongo.update("tenants", {"code": "JST1"}, {$set: tenants[2]}, {
						upsert: true,
						multi: false,
						safe: true
					}, cb);
				}
			});
		}
	});
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
			delete test_env.code;
			mongo.update("environment", {"code": "TEST"}, {$set: test_env}, {
				upsert: true,
				multi: false,
				safe: true
			}, cb);
		}
	});
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

async.series([addRecipes, addService, addProducts, addGit, addOauth, addTenants, addEnv, modifyDashboardDefaults], function (error) {
	if (error) {
		throw error;
	}
	console.log("done");
	mongo.closeDb();
	process.exit();
});
