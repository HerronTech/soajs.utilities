'use strict';
//need to update configSHA, set to correct values when config files on master branch get updated
var soajs_account = {
    "_id": ObjectId('56f1189430f153a571b9c8be'),
    "label": "SOAJS Open Source",
    "username": "soajs",
    "type": "organization",
    "access": "public",
    "repos": [
        {
            "name": "soajs/soajs.controller",
            "type": "service",
            "configSHA": "cf00fc022194c705f085967b3a100482a71dba65"
        },
        {
            "name": "soajs/soajs.dashboard",
            "type": "service",
            "configSHA": "cf00fc022194c705f085967b3a100482a71dba65"
        },
        {
            "name": "soajs/soajs.prx",
            "type": "service",
            "configSHA": "cf00fc022194c705f085967b3a100482a71dba65"
        },
        {
            "name": "soajs/soajs.urac",
            "type": "service",
            "configSHA": "cf00fc022194c705f085967b3a100482a71dba65"
        },
        {
            "name": "soajs/soajs.examples",
            "type": "multi",
            "configSHA": [
                "cf00fc022194c705f085967b3a100482a71dba65",
                "cf00fc022194c705f085967b3a100482a71dba65",
                "cf00fc022194c705f085967b3a100482a71dba65",
                "cf00fc022194c705f085967b3a100482a71dba65",
                "cf00fc022194c705f085967b3a100482a71dba65"
            ]
        },
        {
            "name": "soajs/soajs.gcs",
            "type": "service",
            "configSHA": "cf00fc022194c705f085967b3a100482a71dba65"
        },
        {
            "name": "soajs/soajs.oauth",
            "type": "service",
            "configSHA": "cf00fc022194c705f085967b3a100482a71dba65"
        }
    ]
};