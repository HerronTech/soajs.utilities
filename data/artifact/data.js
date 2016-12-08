var soajs = require("soajs");
var mongo = new soajs.mongo(dbconfig);

/*
 Git Accounts
 */
var records = require('./provision/gitAccounts/soajsRepos');
mongo.update("git_accounts", {"code":"TEST"}, {$set: records}, {upsert:true, multi:false, safe: true},function(err){
	if (err){
		console.log(err);
		process.exit();
	}
	else {
		console.log("git accounts inserted");
		
		
		var test_env = require("./provision/environments/test");
		mongo.findOne("environment", {"code": "DASHBOARD"}, function (err, result){
			if(err){
				console.log(err);
				process.exit();
			}
			if(result){
				test_env.profile = result.profile;
				test_env.deployer = result.deployer;
				test_env.dbs.clusters.test_cluster = result.dbs.clusters.dash_cluster;
				test_env.dbs.config.prefix = dbconfig.prefix;
				test_env.services.config.cookie.secret = result.config.cookie.secret;
				test_env.services.config.session.secret = result.config.session.secret;
				delete test_env.code;
				mongo.update("environment", {"code":"TEST"}, {$set:test_env}, {upsert:true, multi: false, safe: true}, function(err){
					if (err){
						console.log(err);
					}
					else {
						console.log("dashboard environment detected, test environment updated with with following config from dashboard environment before inserting: profile, deployer, " +
							"dbs.clusters.dash_cluster, dbs.config.prefix, services.config.cookie.secret, and services.config.session.secret");
					}
					process.exit();
				});
			}
			else {
				test_env.dbs.config.prefix = dbconfig.prefix;
				delete test_env.code;
				mongo.update("environment", {"code":"TEST"}, {$set:test_env}, {upsert:true, multi: false, safe: true}, function(err){
					if (err){
						console.log(err);
					}
					else {
						console.log("test environment inserted");
					}
					process.exit();
				});
			}
		});
	}
});