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
var files = listFiles('./users');
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
files = listFiles('./users');
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