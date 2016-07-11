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