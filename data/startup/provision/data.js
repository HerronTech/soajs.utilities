/***************************************************************
*
* DASHBOARD CORE_PROVISION
*
***************************************************************/

var provDb = db.getSiblingDB('core_provision');
provDb.dropDatabase();

/*
 DASHBOARD EXT KEYS
 */
var files = listFiles('./extKeys');
files.forEach(function(oneFile){
	load(oneFile.name);
});
var records = extKeys;
provDb.dashboard_extKeys.insert(records);

/*
 Environments
 */
files = listFiles('./environments');
files.forEach(function(oneFile){
	load(oneFile.name);
});
records = [];
records.push(dev);
records.push(dashboard);
provDb.environment.insert(records);

/*
 Products
 */
files = listFiles('./products');
files.forEach(function(oneFile){
	load(oneFile.name);
});
records = [];
records.push(dsbrdProduct);
provDb.products.insert(records);

/*
 Services
 */
files = listFiles('./services');
files.forEach(function(oneFile){
	load(oneFile.name);
});
records = core_services;
provDb.services.insert(records);

/*
 Tenants
 */
files = listFiles('./tenants');
files.forEach(function(oneFile){
	load(oneFile.name);
});
records = [];
records.push(dsbrd);
provDb.tenants.insert(records);

/*
 Git Accounts
 */
files = listFiles('./gitAccounts');
files.forEach(function(oneFile){
	load(oneFile.name);
});
records = [];
records.push(soajs_account);
provDb.git_accounts.insert(records);