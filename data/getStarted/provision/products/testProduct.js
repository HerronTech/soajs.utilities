'use strict';

var testProduct = {
	"_id": "50d2cb5fc04ce51e06000001",
    "code" : "TPROD",
    "name" : "Test Product",
    "description" : "This is another test product for examples.",
    "packages" : [
        {
            "code" : "TPROD_BASIC",
            "name" : "Basic Package",
            "description" : "This package provides access to the Urac service.",
            "acl" : {
                "urac" : {}
            },
            "_TTL" : 86400000 // 24 hours
        },
        {
            "code" : "TPROD_EX03",
            "name" : "Example03 Package",
            "description" : "This package provides access to Urac and Example03 services.",
            "acl" : {
                "urac" : {},
                "example03" : {}
            },
            "_TTL" : 86400000 // 24 hours
        }
    ]
};

module.exports = testProduct;