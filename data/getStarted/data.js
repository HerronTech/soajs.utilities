/***************************************************************
 *
 * DASHBOARD CORE_PROVISION
 *
 ***************************************************************/

var provDb = db.getSiblingDB('getStarted_core_provision');
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
 oauth urac
 */
files = listFiles('./provision/oauth_urac');
files.forEach(function(oneFile){
	load(oneFile.name);
});
records = [];
records.push(oauthuser);
records.push(oauth_user_tenant1);
provDb.oauth_urac.insert(records);

/*
 Products
 */
files = listFiles('./provision/products');
files.forEach(function(oneFile){
	load(oneFile.name);
});
records = [];
records.push(dsbrdProduct);
records.push(product1);
records.push(testProduct);
provDb.products.insert(records);

/*
 Tenants
 */
files = listFiles('./provision/tenants');
files.forEach(function(oneFile){
	load(oneFile.name);
});
records = [];
records.push(dsbrd);
records.push(tenant1);
records.push(tenant2);
records.push(tenant3);
provDb.tenants.insert(records);

/*
 Git Accounts
 */
files = listFiles('./provision/gitAccounts');
files.forEach(function(oneFile){
	load(oneFile.name);
});
records = [];
records.push(soajs_account);
provDb.git_accounts.insert(records);


/***************************************************************
 *
 * DASHBOARD URAC
 *
 ***************************************************************/

var ddb = db.getSiblingDB('getStarted_DBTN_urac');
ddb.dropDatabase();

/*
 Users
 */
files = listFiles('./provision/urac/users');
files.forEach(function(oneFile){
	load(oneFile.name);
});
records = [];
records.push(owner);
ddb.users.insert(records);

/*
 Groups
 */
files = listFiles('./provision/urac/groups');
files.forEach(function(oneFile){
	load(oneFile.name);
});
records = [];
records.push(owner);
ddb.groups.insert(records);

//users
ddb.users.ensureIndex({username: 1}, { unique: true });
ddb.users.ensureIndex({email: 1}, { unique: true });
ddb.users.ensureIndex({username: 1, status: 1});
ddb.users.ensureIndex({email: 1, status: 1});
ddb.users.ensureIndex({groups: 1, 'tenant.id': 1});
ddb.users.ensureIndex({username: 1, 'tenant.id': 1});
ddb.users.ensureIndex({status: 1});
ddb.users.ensureIndex({locked: 1});
ddb.users.ensureIndex({'tenant.id': 1});

//groups
ddb.groups.ensureIndex({code: 1, 'tenant.id': 1});
ddb.groups.ensureIndex({code: 1});
ddb.groups.ensureIndex({'tenant.id': 1});
ddb.groups.ensureIndex({locked: 1});

//tokens
ddb.tokens.ensureIndex({token: 1}, { unique: true});
ddb.tokens.ensureIndex({userId: 1, service: 1, status: 1});
ddb.tokens.ensureIndex({token: 1, service: 1, status: 1});

/***************************************************************
 *
 * Custom Tenant URAC
 *
 ***************************************************************/

var ddb = db.getSiblingDB('test_urac');
ddb.dropDatabase();

/*
 Users
 */
var files = listFiles('./urac/users');
files.forEach(function(oneFile){
	load(oneFile.name);
});
var records = [];
records.push(user4);
records.push(user5);
records.push(user6);
ddb.users.insert(records);

//users
ddb.users.ensureIndex({username: 1}, { unique: true });
ddb.users.ensureIndex({email: 1}, { unique: true });
ddb.users.ensureIndex({username: 1, status: 1});
ddb.users.ensureIndex({email: 1, status: 1});
ddb.users.ensureIndex({groups: 1, 'tenant.id': 1});
ddb.users.ensureIndex({username: 1, 'tenant.id': 1});
ddb.users.ensureIndex({status: 1});
ddb.users.ensureIndex({locked: 1});
ddb.users.ensureIndex({'tenant.id': 1});
ddb.users.ensureIndex({_id: 1, status: 1});
ddb.users.ensureIndex({_id: 1, locked: 1});


//groups
ddb.groups.ensureIndex({'tenant.id': 1, code: 1});
ddb.groups.ensureIndex({code: 1});
ddb.groups.ensureIndex({'tenant.id': 1});
ddb.groups.ensureIndex({locked: 1});
ddb.groups.ensureIndex({code: 1, tenant: 1});

//tokens
ddb.tokens.ensureIndex({token: 1}, { unique: true});
ddb.tokens.ensureIndex({userId: 1, service: 1, status: 1});
ddb.tokens.ensureIndex({token: 1, service: 1, status: 1});

var ddbT = db.getSiblingDB('TNT1_urac');
ddbT.dropDatabase();

/*
 Users
 */
files = listFiles('./urac/users');
files.forEach(function(oneFile){
	load(oneFile.name);
});
records = [];
records.push(user1);
records.push(user2);
records.push(user3);
ddbT.users.insert(records);

//users
ddbT.users.ensureIndex({username: 1}, { unique: true });
ddbT.users.ensureIndex({email: 1}, { unique: true });
ddbT.users.ensureIndex({username: 1, status: 1});
ddbT.users.ensureIndex({email: 1, status: 1});
ddbT.users.ensureIndex({groups: 1, 'tenant.id': 1});
ddbT.users.ensureIndex({username: 1, 'tenant.id': 1});
ddbT.users.ensureIndex({status: 1});
ddbT.users.ensureIndex({locked: 1});
ddbT.users.ensureIndex({'tenant.id': 1});
ddbT.users.ensureIndex({_id: 1, status: 1});
ddbT.users.ensureIndex({_id: 1, locked: 1});

//groups
ddbT.groups.ensureIndex({'tenant.id': 1, code: 1});
ddbT.groups.ensureIndex({code: 1});
ddbT.groups.ensureIndex({'tenant.id': 1});
ddbT.groups.ensureIndex({locked: 1});
ddbT.groups.ensureIndex({code: 1, tenant: 1});

//tokens
ddbT.tokens.ensureIndex({token: 1}, { unique: true});
ddbT.tokens.ensureIndex({userId: 1, service: 1, status: 1});
ddbT.tokens.ensureIndex({token: 1, service: 1, status: 1});