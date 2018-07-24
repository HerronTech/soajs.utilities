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
            name: "soajs/soajs.jsconf",
            type: "multi",
            configBranch: "master",
            configSHA: [
                {
                    contentType: "service",
                    contentName: "jsconf1",
                    path: "/services/s1/config.js"
                },
                {
                    contentType: "service",
                    contentName: "jsconf2",
                    path: "/services/s2/config.js"
                },
                {
                    contentType: "service",
                    contentName: "jsconf3",
                    path: "/services/s3/config.js"
                },
                {
                    contentType: "service",
                    contentName: "jsconf4",
                    path: "/services/s4/config.js"
                }
            ]
        }
	]
};

module.exports = soajs_account;