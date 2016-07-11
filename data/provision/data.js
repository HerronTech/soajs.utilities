/***************************************************************
*
* DASHBOARD CORE_PROVISION
*
***************************************************************/

var provDb = db.getSiblingDB('core_provision');
provDb.dropDatabase();

/*
 DASHBOARD EXT KEYS
 */
var files = listFiles('./extKeys');
files.forEach(function(oneFile){
	load(oneFile.name);
});
var records = extKeys;
provDb.dashboard_extKeys.insert(records);

/*
 Environments
 */
files = listFiles('./environments');
files.forEach(function(oneFile){
	load(oneFile.name);
});
var internalMachine = this.machine || null;
var cloudMachine = this.cloudmachine || null;
var internalDocker = this.docker || null;
var internalMongoIP = this.mongoIP || "127.0.0.1";
var internalDevMongoIP = this.devMongoIP || "127.0.0.1";
records = [];
dashboard.deployer.type = "manual";
dev.deployer.type = "manual";
if (internalDocker || internalMachine || cloudMachine) {
	dashboard.deployer.type = "container";
	dev.deployer.type = "container";
	dashboard.dbs.clusters.dash_cluster.servers[0].host = internalMongoIP;
	dev.dbs.clusters.dev_cluster.servers[0].host = internalDevMongoIP;

	if (internalDocker) {
		dashboard.deployer.selected = "container.docker.socket";
		dev.deployer.selected = "container.docker.socket";
	}
	if (internalMachine) {
		dashboard.deployer.selected = "container.dockermachine.local";
		dev.deployer.selected = "container.dockermachine.local";
		dashboard.deployer.container.dockermachine.local.host = internalMongoIP;
		dev.deployer.container.dockermachine.local.host = internalDevMongoIP;
	}
	if (cloudMachine) {
		dashboard.deployer.selected = "container.dockermachine.cloud.rackspace";
		dev.deployer.selected = "container.dockermachine.cloud.rackspace";
		dashboard.deployer.container.dockermachine.cloud.rackspace.host = internalMongoIP;
		dev.deployer.container.dockermachine.cloud.rackspace.host = internalDevMongoIP;
	}
}

records.push(dev);
records.push(dashboard);
provDb.environment.insert(records);

/*
    oauth urac
 */
files = listFiles('./oauth_urac');
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
files = listFiles('./products');
files.forEach(function(oneFile){
	load(oneFile.name);
});
records = [];
records.push(dsbrdProduct);
records.push(client);
records.push(product1);
records.push(testProduct);
provDb.products.insert(records);

/*
 Services
 */
files = listFiles('./services');
files.forEach(function(oneFile){
	load(oneFile.name);
});
records = core_services;
provDb.services.insert(records);

/*
 Tenants
 */
files = listFiles('./tenants');
files.forEach(function(oneFile){
	load(oneFile.name);
});
records = [];
records.push(dsbrd);
records.push(client);
records.push(tenant1);
records.push(tenant2);
records.push(tenant3);
records.push(test);
provDb.tenants.insert(records);

/*
 GCS
 */
files = listFiles('./gc');
files.forEach(function(oneFile){
	load(oneFile.name);
});
records = [];
records.push(gc);
provDb.gc.insert(records);

/*
 Git Accounts
 */
files = listFiles('./gitAccounts');
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

var ddb = db.getSiblingDB('DBTN_urac');
ddb.dropDatabase();

/*
 Users
 */
files = listFiles('./urac/users');
files.forEach(function(oneFile){
	load(oneFile.name);
});
records = [];
records.push(admin);
records.push(owner);
records.push(adminT1);
records.push(adminT2);
records.push(adminT3);
records.push(testAdmin);
ddb.users.insert(records);

/*
 Groups
 */
files = listFiles('./urac/groups');
files.forEach(function(oneFile){
	load(oneFile.name);
});
records = [];
records.push(owner);
records.push(administrator);
records.push(administratorT1);
records.push(administratorT2);
records.push(administratorT3);
records.push(testAdministrator);
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