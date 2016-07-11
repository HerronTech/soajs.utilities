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
records.push(owner);
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
ddb.groups.insert(records);

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