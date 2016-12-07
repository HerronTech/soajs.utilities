/***************************************************************
*
* DASHBOARD CORE_PROVISION
*
***************************************************************/
var soajs = require("soajs");
var mongo = new soajs.mongo(dbconfig);

/*
 Environments
 */
//todo:
/*
	abel ma ta3mil insert,
	
	check iza fi dashboard environment.
	
	if yes, load the record and clone the following variables to the test environment then insert it:
	- profile
    - deployer
    - dbs.clusters.test_cluster = dashboard.dbs.clusters.dash_cluster
	- dbs.config.prefix
	- services.config.cookie.secret
	- services.config.session.secret
 */
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
		test_env.dbs.config.prefix = result.dbs.config.prefix;
		test_env.services.config.cookie.secret = result.config.cookie.secret;
		test_env.services.config.session.secret = result.config.session.secret;
		
		mongo.update("environment", {}, test_env, {upsert:true},{}, function(err){
			if (err){
				console.log(err);
				process.exit();
			}
			else {
				console.log("dashboard environment detected, test environment updated with with following config from dashboard environment before inserting: profile, deployer, " +
					"dbs.clusters.dash_cluster, dbs.config.prefix, services.config.cookie.secret, and services.config.session.secret");
			}
		});
	}
	else {
		mongo.update("environment",{}, test_env, {upsert:true},{}, function(err){
			if (err){
			console.log(err);
			process.exit();
		}
		else {
			console.log("test environment inserted");
		}
	});
	}
});

/*
 Git Accounts
 */
var records = require('./provision/gitAccounts/soajsRepos');
mongo.update("git_accounts", records,{}, {upsert:true},{},function(err){
	if (err){
		console.log(err);
		process.exit();
	}
	else {
		console.log("git accounts inserted");
	}
});