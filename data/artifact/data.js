var soajs = require("soajs");
var mongo = new soajs.mongo(dbconfig);
var util = require("soajs.core.libs").utils;
var dbConfClone = util.cloneObj(dbconfig);
dbConfClone.name = "myContacts";
var mongoContacts = new soajs.mongo(dbConfClone);
var keySecurity = "soajs key lal massa";

function addRecipes(cb) {
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
	var service = require('./provision/services/services');
	service._id = new mongo.ObjectId(service._id);
	
	var condition = {
		"name": service.name
	};
	delete service.name;
	mongo.update("services", condition, {"$set": service}, {upsert: true, multi: false, safe: true}, cb);
}

/*
 Git Accounts
 */
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

/*
 Environment
 */

function addEnv(cb) {
	var test_env = require('./provision/environments/test.js');
	
	mongo.findOne("environment", {"code": "DASHBOARD"}, function (err, result) {
		if (err) {
			return cb(err);
		}
		if (result) {
			test_env.profile = result.profile;
			test_env.deployer = result.deployer;

			if(result.dbs && result.dbs.cluster && result.dbs.cluster.dash_cluster){
                test_env.dbs.clusters.test_cluster = result.dbs.clusters.dash_cluster;
			}

			test_env.dbs.config.prefix = dbconfig.prefix;
			test_env.services.config.cookie.secret = result.services.config.cookie.secret;
			test_env.services.config.session.secret = result.services.config.session.secret;
			keySecurity = result.services.config.key;
			delete test_env.code;
			mongo.update("environment", {"code": "TEST"}, {$set: test_env}, {
				upsert: true,
				multi: false,
				safe: true
			}, function(error){
                if (error){
                    return cb(error)
                }
                addInfra(cb)
            });
		}
		else {
			test_env.dbs.config.prefix = dbconfig.prefix;
			test_env.profile = __dirname + test_env.profile;
			delete test_env.code;
			mongo.update("environment", {"code": "TEST"}, {$set: test_env}, {
				upsert: true,
				multi: false,
				safe: true
			}, function(error){
				if (error){
					return cb(error)
				}
				addInfra(cb)
			});
		}
	});
}

function addInfra(cb){
    mongo.findOne("infra", {
        "deployments.environments": {"$in": ["DASHBOARD"]}
    }, (error, infraProvider) => {
        if (error) {
            return cb(error);
        }

        if(!infraProvider){
            return cb(null, true);
        }


        var deployments = infraProvider.deployments;
        deployments.forEach(function(deployment){
            if(deployment.environments.indexOf("TEST") === -1){
                deployment.environments.push("TEST");
            }

        });

        console.log("TEST environment added");
        mongo.save("infra", infraProvider, cb);
    });
}
function modifyDashboardDefaults(cb) {
	mongo.findOne("products", {"code": "DSBRD", "locked": true}, function (error, dsbrdProduct) {
		if (error) {
			return cb(error);
		}
		
		if (!dsbrdProduct) {
			return cb(null);
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

function addContacts(cb) {
	var contacts = require('./provision/contacts/');
	
	contacts.forEach(function (contact) {
		contact._id = mongo.ObjectId(contact._id);
	});
	
	mongoContacts.remove("records", {}, function (error) {
		if (error) {
			return cb(error);
		}
		mongoContacts.insert("records", contacts, function (err) {
			if (err) {
				return cb(err);
			}
			return cb();
		});
	});
}

addRecipes(function (error) {
	if (error) {
		throw error;
	}
	
	addGit(function (error) {
		if (error) {
			throw error;
		}
		
		addEnv(function (error) {
			if (error) {
				throw error;
			}
			
			addService(function (error) {
				if (error) {
					throw error;
				}
				
				modifyDashboardDefaults(function (error) {
					if (error) {
						throw error;
					}
					
					addContacts(function (error) {
						if (error) {
							throw error;
						}
						console.log("done");
						process.exit();
					});
				});
			});
		});
	})
});