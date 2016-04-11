var provDb = db.getSiblingDB('core_provision');
//provDb.dropDatabase();

provDb.docker.drop();
provDb.git_accounts.drop();
provDb.staticContent.drop();
provDb['fs.files'].drop();

var files = listFiles('./extKeys');
for (var i = 0; i < files.length; i++) {
    load(files[i].name);
}

var keys = extKeys;
provDb.dashboard_extKeys.drop();
provDb.dashboard_extKeys.insert(keys);


var files = listFiles('./environments');
for (var i = 0; i < files.length; i++) {
	load(files[i].name);
}

provDb.environment.drop();

var internalMachine = this.machine || null;
var internalDocker = this.docker || null;
var internalMongoIP = this.mongoIP || "127.0.0.1";
var internalDevMongoIP = this.devMongoIP || "127.0.0.1";
var records = [];
if (internalDocker || internalMachine) {
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
}
else {
	dashboard.deployer.type = "manual";
	dev.deployer.type = "manual";
}
records.push(dev);
records.push(dashboard);
provDb.environment.insert(records);

/* Indexes for products */
provDb.environment.ensureIndex({ code: 1 }, { unique: true });



var provDb = db.getSiblingDB('core_provision');

/* oAuth URAC */
var files = listFiles('./oauth_urac');
for (var i = 0; i < files.length; i++) {
	load(files[i].name);
}

provDb.oauth_urac.drop();

var records = [];
records.push(oauthuser);
records.push(oauth_user_tenant1);
provDb.oauth_urac.insert(records);


/* Products */
provDb.oauth_urac.ensureIndex({ userId: 1 }, { unique: true });


var files = listFiles('./products');
for (var i = 0; i < files.length; i++) {
	load(files[i].name);
}

provDb.products.drop();

var records = [];
records.push(dsbrdProduct);
records.push(client);
records.push(product1);
records.push(testProduct);
provDb.products.insert(records);

/* Indexes for products */
provDb.products.ensureIndex({ code: 1 }, { unique: true });
provDb.products.ensureIndex({ 'packages.code': 1 } );

/* services */
var provDb = db.getSiblingDB('core_provision');
//provDb.dropDatabase();

var files = listFiles('./services');
for (var i = 0; i < files.length; i++) {
    load(files[i].name);
}

provDb.services.drop();

provDb.docker.drop();

var records = core_services;
provDb.services.insert(records);

/* Indexes for services */
provDb.services.ensureIndex({name: 1}, {unique: true});
provDb.services.ensureIndex({'port': 1}, {unique: true});
provDb.services.ensureIndex({'extKeyRequired': 1});

provDb.hosts.drop();

/* Indexes for hosts */
provDb.hosts.ensureIndex({env: 1});
provDb.hosts.ensureIndex({'name': 1});


/* Tenants */
var files = listFiles('./tenants');
for (var i = 0; i < files.length; i++) {
	load(files[i].name);
}

provDb.tenants.drop();

var records = [];
records.push(dsbrd);
records.push(client);
records.push(tenant1);
records.push(tenant2);
records.push(tenant3);
records.push(test);

provDb.tenants.insert(records);

/* Indexes for tenants */
provDb.tenants.ensureIndex({ code: 1 }, { unique: true });
provDb.tenants.ensureIndex({ 'applications.appId': 1 } );
provDb.tenants.ensureIndex({ 'applications.keys.key': 1 } );

/* GC */
var files = listFiles('./gc');
for (var i = 0; i < files.length; i++) {
	load(files[i].name);
}

provDb.gc.drop();

var records = [];
records.push(gc);
provDb.gc.insert(records);

/*GIT ACCOUNTS*/
var files = listFiles('./gitAccounts');
for (var i = 0; i < files.length; i++) {
	load(files[i].name);
}

provDb.git_accounts.drop();

var records = [];
records.push(soajs_account);
provDb.git_accounts.insert(records);

/* DBTN URAC */
var ddb = db.getSiblingDB('DBTN_urac');
//provDb.dropDatabase();

/* users */
var files = listFiles('./urac/users');
for(var i = 0; i < files.length; i++) {
	load(files[i].name);
}

ddb.users.drop();

var records = [];
records.push(admin);
records.push(owner);

records.push(adminT1);
records.push(adminT2);
records.push(adminT3);
records.push(testAdmin);

ddb.users.insert(records);

/* add grps */
var gfiles = listFiles('./urac/groups');
for(var i = 0; i < gfiles.length; i++) {
	load(gfiles[i].name);
}

ddb.groups.drop();

var records = [];
records.push(owner);
records.push(administrator);
records.push(administratorT1);
records.push(administratorT2);
records.push(administratorT3);
records.push(testAdministrator);

ddb.groups.insert(records);