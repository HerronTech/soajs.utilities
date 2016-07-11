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