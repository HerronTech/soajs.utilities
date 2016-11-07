var provDb = db.getSiblingDB('core_provision');

/*
 Import Products
 */
provDb.products.remove({});

var files = listFiles('./products');
for (var i = 0; i < files.length; i++) {
	load(files[i].name);
}

var records = products;
provDb.products.insert(records);


/*
 Import Tenants
 */
provDb.tenants.remove({});

var files = listFiles('./tenants');
for (var i = 0; i < files.length; i++) {
	load(files[i].name);
}

var records = tenants;
provDb.tenants.insert(records);

/*
 Import oAuth Users
 */
provDb.oauth_urac.remove({});

var files = listFiles('./oauth_urac');
for (var i = 0; i < files.length; i++) {
	load(files[i].name);
}

var records = users;
provDb.oauth_urac.insert(records);


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