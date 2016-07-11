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
records.push(user3);
records.push(user2);
records.push(user1);
ddb.users.insert(records);

//users
ddb.ensureIndex("users", {username: 1}, { unique: true });
ddb.ensureIndex("users", {email: 1}, { unique: true });
ddb.ensureIndex("users", {username: 1, status: 1});
ddb.ensureIndex("users", {email: 1, status: 1});
ddb.ensureIndex("users", {groups: 1, 'tenant.id': 1});
ddb.ensureIndex("users", {username: 1, 'tenant.id': 1});
ddb.ensureIndex("users", {status: 1});
ddb.ensureIndex("users", {locked: 1});
ddb.ensureIndex("users", {'tenant.id': 1});

//groups
ddb.ensureIndex("groups", {code: 1, 'tenant.id': 1});
ddb.ensureIndex("groups", {code: 1});
ddb.ensureIndex("groups", {'tenant.id': 1});
ddb.ensureIndex("groups", {locked: 1});

//tokens
ddb.ensureIndex("tokens", {token: 1}, { unique: true});
ddb.ensureIndex("tokens", {userId: 1, service: 1, status: 1});
ddb.ensureIndex("tokens", {token: 1, service: 1, status: 1});

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
records.push(user3);
records.push(user2);
ddbT.users.insert(records);

//users
ddbT.ensureIndex("users", {username: 1}, { unique: true });
ddbT.ensureIndex("users", {email: 1}, { unique: true });
ddbT.ensureIndex("users", {username: 1, status: 1});
ddbT.ensureIndex("users", {email: 1, status: 1});
ddbT.ensureIndex("users", {groups: 1, 'tenant.id': 1});
ddbT.ensureIndex("users", {username: 1, 'tenant.id': 1});
ddbT.ensureIndex("users", {status: 1});
ddbT.ensureIndex("users", {locked: 1});
ddbT.ensureIndex("users", {'tenant.id': 1});

//groups
ddbT.ensureIndex("groups", {code: 1, 'tenant.id': 1});
ddbT.ensureIndex("groups", {code: 1});
ddbT.ensureIndex("groups", {'tenant.id': 1});
ddbT.ensureIndex("groups", {locked: 1});

//tokens
ddbT.ensureIndex("tokens", {token: 1}, { unique: true});
ddbT.ensureIndex("tokens", {userId: 1, service: 1, status: 1});
ddbT.ensureIndex("tokens", {token: 1, service: 1, status: 1});