var soajs = require("soajs");
var mongo = new soajs.mongo(dbconfig);


var addProducts = function(cb) {
	var products = require('./provision/products/products.js');
	
	mongo.update("products",{"code":"PRODA"}, {$set:products},{upsert:true, multi: false, safe: true} ,cb);
};

var addGit = function(cb){
	var git = require('./provision/gitAccounts/soajsRepos.js');
	mongo.update("git_accounts", {"owner": "soajs"}, {$set:git}, {upsert:true, multi: false, safe: true}, cb)
};

var addOauth = function (cb){
	var oauth = require('./provision/oauth_urac/users.js');
	oauth._id = new mongo.ObjectId(oauth._id);
	oauth.tId = new mongo.ObjectId(oauth.tId);
	
	mongo.update("oauth_urac", {"userId": "myuser"}, {$set:oauth}, {upsert:true, multi: false, safe: true}, cb)
};

var addTenants = function(cb){
	var tenants = require('./provision/tenants/tenants.js');
	
	
	tenants.forEach(function(oneTenant){
		oneTenant._id = new mongo.ObjectId(oneTenant._id.toString());
		});
	tenants.forEach(function(oneTenant){
		oneTenant.applications.forEach(function(oneApp){
			oneApp.appId = new mongo.ObjectId(oneApp.appId.toString());
		});
	});
	mongo.update("tenants",{"code":"JST2"},{$set:tenants[0]}, {upsert:true, multi:false, safe:true}, function(err1, res1){
		if(err1){
			return cb(err1);
		}
		else {
			mongo.update("tenants", {"code": "JSTE"}, {$set: tenants[1]}, {upsert: true, multi: false, safe: true}, function (err2, res2) {
				if (err2) {
					return cb(err2);
				}
				else {
					mongo.update("tenants", {"code": "JST1"}, {$set: tenants[2]}, {upsert: true, multi: false, safe: true}, cb);
				}
			});
		}
	});
};

var addEnv = function(cb){
	var test_env = require('./provision/environments/test.js');
	
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
			mongo.update("environment", {"code":"TEST"}, {$set:test_env}, {upsert:true, multi: false, safe: true}, cb);
		}
		else {
			test_env.dbs.config.prefix = dbconfig.prefix;
			delete test_env.code;
			mongo.update("environment", {"code":"TEST"}, {$set:test_env}, {upsert:true, multi: false, safe: true}, cb);
		}
	});
};

addProducts(function(){
	addGit(function(){
		addOauth(function(){
			addTenants(function(){
				addEnv(function(){
					mongo.closeDb();
				});
			});
		});
	});
});
