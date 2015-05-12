var client = {
	"_id": ObjectId('5552142fe179c39b760f7a1e'),
	"code": "CPROD",
	"name": "Client Product",
	"description": "This Product is for the dashboard client and gives access to example 03 and 04.",
	"packages": [
		{
			"code": "CPROD_MAIN",
			"name": "Main Client Product Package",
			"description": "This package offers both example03 and example04",
			"acl": {
				"example03": {},
				"example04": {}
			},
			"_TTL": 86400000
		}
	]
};
