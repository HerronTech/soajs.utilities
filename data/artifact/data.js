var soajs = require("soajs");
var mongo = new soajs.mongo(dbconfig);

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
			console.log("done");
			process.exit();
		});
	});
});