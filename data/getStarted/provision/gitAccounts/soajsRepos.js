'use strict';
//need to update configSHA, set to correct values when config files on master branch get updated
var soajs_account = {
	"label": "SOAJS Open Source",
	"owner": "soajs",
	"provider": "github",
	"type": "organization",
	"access": "public",
	"repos": [
		{
			"name": "soajs/soajs.controller",
			"type": "service"
		},
		{
			"name": "soajs/soajs.oauth",
			"type": "service"
		},
		{
			"name": "soajs/soajs.urac",
			"type": "service"
		},
		{
			"name": "soajs/soajs.examples",
			"type": "service"
		}
	]
};

module.exports = soajs_account;