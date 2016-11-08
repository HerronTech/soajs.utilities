var provDb = db.getSiblingDB('core_provision');
provDb.dropDatabase();

/*
 DASHBOARD EXT KEYS
 */
var files = listFiles('./provision/extKeys');
files.forEach(function(oneFile){
	load(oneFile.name);
});
var records = extKeys;
provDb.dashboard_extKeys.insert(records);

/*
 Import Products
 */
provDb.products.remove({});

var files = listFiles('./provision/products');
for (var i = 0; i < files.length; i++) {
	load(files[i].name);
}

var records = products;
provDb.products.insert(records);


/*
 Import Tenants
 */
provDb.tenants.remove({});

var files = listFiles('./provision/tenants');
for (var i = 0; i < files.length; i++) {
	load(files[i].name);
}

var records = tenants;
provDb.tenants.insert(records);

/*
 Import oAuth Users
 */
provDb.oauth_urac.remove({});

var files = listFiles('./provision/oauth_urac');
for (var i = 0; i < files.length; i++) {
	load(files[i].name);
}

var records = users;
provDb.oauth_urac.insert(records);


/*
 Git Accounts
 */
files = listFiles('./provision/gitAccounts');
files.forEach(function(oneFile){
	load(oneFile.name);
});
var records = [];
records.push(soajs_account);
provDb.git_accounts.insert(records);

/*
 Environments
 */
files = listFiles('./provision/environments');
files.forEach(function(oneFile){
	load(oneFile.name);
});

records = [];
records.push(dev);
records.push(dashboard);
provDb.environment.insert(records);

var updateDocument = {
	"dbs.clusters.dash_cluster.servers" : [
		{
			"host": this.mongoIp,
			"port": this.mongoPort
		}
	]
};

if(this.mongoUser && this.mongoUser !== "" && this.mongoPwd && this.mongoPwd !== "" && this.mongoAuth && this.mongoAuth !== ""){
	updateDocument['dbs.clusters.dash_cluster.credentials'] = {
		username: this.mongoUser,
		password: this.mongoPwd
	};
	updateDocument['dbs.clusters.dash_cluster.URLParam.authSource']= this.mongoAuth;
}
provDb.environment.update({"code": "DASHBOARD"}, {$set: updateDocument });

var updateDocument = {
	"dbs.clusters.dev_cluster.servers" : [
		{
			"host": this.mongoIp,
			"port": this.mongoPort
		}
	]
};

if(this.mongoUser && this.mongoUser !== "" && this.mongoPwd && this.mongoPwd !== "" && this.mongoAuth && this.mongoAuth !== ""){
	updateDocument['dbs.clusters.dev_cluster.credentials'] = {
		username: this.mongoUser,
		password: this.mongoPwd
	};
	updateDocument['dbs.clusters.dev_cluster.URLParam.authSource']= this.mongoAuth;
}
provDb.environment.update({"code": "DEV"}, {$set: updateDocument });


/*
 Updated Dev Env, add databases
 */
provDb.environment.update(
	{"code": "DEV"},
	{
		"$set": {
			"dbs.databases.myDatabase": {
				"cluster": "dev_cluster",
				"tenantSpecific": false
			},
			"dbs.databases.users": {
				"cluster": "dev_cluster",
				"tenantSpecific": true
			}
		}
	}
);