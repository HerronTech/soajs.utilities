'use strict';
//need to update configSHA, set to correct values when config files on master branch get updated
var soajs_account = {
	"_id": ObjectId('56f1189430f153a571b9c8be'),
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
			"name": "soajs/soajs.dashboard",
			"type": "service"
		},
		{
			"name": "soajs/soajs.prx",
			"type": "service"
		},
		{
			"name": "soajs/soajs.urac",
			"type": "service"
		},
		{
			"name": "soajs/soajs.gcs",
			"type": "service"
		}
	]
};