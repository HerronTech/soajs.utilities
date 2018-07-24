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
			"serviceName": "controller",
			"type": "service"
		},
		{
			"name": "soajs/soajs.oauth",
            "serviceName": "oauth",
			"type": "service"
		},
		{
			"name": "soajs/soajs.urac",
            "serviceName": "urac",
			"type": "service"
		},
		{
            name: "soajs/soajs.examples",
            type: "multi",
            configBranch: "master",
            configSHA: [
                {
                    contentType: "service",
                    contentName: "example01",
                    path: "/example01/config.js"
                },
                {
                    contentType: "service",
                    contentName: "example02",
                    path: "/example02/config.js"
                },
                {
                    contentType: "service",
                    contentName: "example03",
                    path: "/example03/config.js"
                },
                {
                    contentType: "service",
                    contentName: "helloworld",
                    path: "/hello_world/config.js"
                }
            ]
		}
	]
};

module.exports = soajs_account;