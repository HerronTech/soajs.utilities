/* DBTN URAC */
var ddb = db.getSiblingDB('DBTN_urac');

/* users */
var files = listFiles('./urac/users');
for(var i = 0; i < files.length; i++) {
	load(files[i].name);
}

ddb.users.drop();
var records = [];
records.push(owner);
ddb.users.insert(records);

/* add grps */
var gfiles = listFiles('./urac/groups');
for(var i = 0; i < gfiles.length; i++) {
	load(gfiles[i].name);
}

ddb.groups.drop();
var records = [];
records.push(owner);
ddb.groups.insert(records);