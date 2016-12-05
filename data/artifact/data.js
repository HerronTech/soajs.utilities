/***************************************************************
*
* DASHBOARD CORE_PROVISION
*
***************************************************************/
var mongo = db.getSiblingDB('artifact_core_provision');
mongo.dropDatabase();

/*
 DASHBOARD EXT KEYS
 */
var files = listFiles('./provision/extKeys');
files.forEach(function(oneFile){
	load(oneFile.name);
});
var records = extKeys;
mongo.dashboard_extKeys.insert(records);

/*
 Environments
 */
files = listFiles('./provision/environments');
files.forEach(function(oneFile){
	load(oneFile.name);
});

records = [];
records.push(dashboard);
records.push(dev);
mongo.environment.insert(records);
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
mongo.environment.update({"code": "DASHBOARD"}, {$set: updateDocument });

/*
 Products
 */
files = listFiles('./provision/products');
files.forEach(function(oneFile){
	load(oneFile.name);
});
records = [];
records.push(dsbrdProduct);
mongo.products.insert(records);

/*
 Tenants
 */
files = listFiles('./provision/tenants');
files.forEach(function(oneFile){
	load(oneFile.name);
});
records = [];
records.push(dsbrd);
mongo.tenants.insert(records);

/*
 Git Accounts
 */
files = listFiles('./provision/gitAccounts');
files.forEach(function(oneFile){
	load(oneFile.name);
});
records = [];
records.push(soajs_account);
mongo.git_accounts.insert(records);


/***************************************************************
 *
 * DASHBOARD URAC
 *
 ***************************************************************/

var ddb = db.getSiblingDB('artifact_DBTN_urac');
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