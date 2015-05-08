var provDb = db.getSiblingDB('core_provision');
//provDb.dropDatabase();

var files = listFiles('./environments');
for (var i = 0; i < files.length; i++) {
	load(files[i].name);
}

provDb.environment.drop();

var records = [];
records.push(dev);
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
records.push(DbTenant);
records.push(test);
records.push(tenant1);
records.push(tenant2);
records.push(tenant3);

provDb.tenants.insert(records);

/* Indexes for tenants */
provDb.tenants.ensureIndex({ code: 1 }, { unique: true });
provDb.tenants.ensureIndex({ 'applications.appId': 1 } );
provDb.tenants.ensureIndex({ 'applications.keys.key': 1 } );


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
ddb.users.insert(records);

/* add grps */
var gfiles = listFiles('./urac/groups');
for(var i = 0; i < gfiles.length; i++) {
	load(gfiles[i].name);
}

ddb.groups.drop();

var records = [];
records.push(administrator);
ddb.groups.insert(records);