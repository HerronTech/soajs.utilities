var provDb = db.getSiblingDB('core_provision');

provDb.environment.drop();

var files = listFiles('./environments');
for (var i = 0; i < files.length; i++) {
	load(files[i].name);
}
var records = [];
records.push(dev);
records.push(dashboard);
provDb.environment.insert(records);

/* Indexes for products */
provDb.environment.ensureIndex({ code: 1 }, { unique: true });

provDb.docker.drop();
provDb.staticContent.drop();
provDb['fs.files'].drop();

var files = listFiles('./extKeys');
for (var i = 0; i < files.length; i++) {
	load(files[i].name);
}

var keys = extKeys;
provDb.dashboard_extKeys.drop();
provDb.dashboard_extKeys.insert(keys);

provDb.oauth_urac.drop();
/* Products */
provDb.oauth_urac.ensureIndex({ userId: 1 }, { unique: true });


var files = listFiles('./products');
for (var i = 0; i < files.length; i++) {
	load(files[i].name);
}

provDb.products.drop();

var records = [];
records.push(dsbrdProduct);
provDb.products.insert(records);

/* Indexes for products */
provDb.products.ensureIndex({ code: 1 }, { unique: true });
provDb.products.ensureIndex({ 'packages.code': 1 } );

/* services */
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
provDb.tenants.insert(records);

/* Indexes for tenants */
provDb.tenants.ensureIndex({ code: 1 }, { unique: true });
provDb.tenants.ensureIndex({ 'applications.appId': 1 } );
provDb.tenants.ensureIndex({ 'applications.keys.key': 1 } );

/*GIT ACCOUNTS*/
var files = listFiles('./gitAccounts');
for (var i = 0; i < files.length; i++) {
	load(files[i].name);
}

provDb.git_accounts.drop();
var records = [];
records.push(soajs_account);
provDb.git_accounts.insert(records);