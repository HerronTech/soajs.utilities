'use strict';

var administrator = {
	"_id": ObjectId('55128764e603d7e01ab1688f'), 
	"locked" : true,
	"code": "administrator",
	"name": "administrator",	 
	"description": "this is the administrator group",
	"permissions":["members",
					"environments",
					"productization",
					"productization_packages",
					"multi-tenancy",
					"multi-tenancy_applications",
					"multi-tenancy_keys" ] // to union with tenant permissions on login
};