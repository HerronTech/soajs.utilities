var products = {
	"code": "PRODA",
	"name": "Product A",
	"description": "This Product provides ACL to JSConf Services.",
	"packages": [
		{
			"code": "PRODA_BASIC",
			"name": "Basic",
			"description": "This Package grants access to hello world APIs only.",
			"acl": {
				"test": {
					"jsconf3": {
						"apis": {
							"/hello": {}
						},
						"access": false,
						"apisPermission": "restricted"
					},
					"jsconf2": {
						"apis": {
							"/hello": {}
						},
						"access": false,
						"apisPermission": "restricted"
					},
					"jsconf4": {
						"apis": {
							"/hybrid": {}
						},
						"access": false,
						"apisPermission": "restricted"
					}
				}
			},
			"_TTL": 21600000
		},
		{
			"code": "PRODA_GOLD",
			"name": "Gold",
			"description": "This Package grants access to all APIs",
			"acl": {
				"test": {
					"jsconf2": {
						"apis": {},
						"access": false
					},
					"jsconf3": {
						"apis": {},
						"access": false
					},
					"jsconf4": {
						"apis": {},
						"access": false
					},
					"oauth": {
						"access": false
					}
				}
			},
			"_TTL": 21600000
		}
	]
};

module.exports = products;