'use strict';
var fs = require('fs');

var mongoNb = process.env.SOAJS_MONGO_NB || 1;
mongoNb = parseInt(mongoNb);
var mongoRsName = process.env.SOAJS_MONGO_RSNAME || "rs_soajs";

var profileLocation = process.env.SOAJS_PROFILE_LOC || "/opt/soajs/FILES/profiles/";


var lib = {
    "writeSingle": function (param, cb) {
        console.log("writing single profile @" + param.loc);
        var wstream = fs.createWriteStream(param.loc + param.profileFileName);

        wstream.write('\'use strict\';\n');
        wstream.write('module.exports = {\n');
        wstream.write('    "name": "core_provision",\n');
        wstream.write('    "prefix": "",\n');
        wstream.write('    "servers": [\n');

        for (var i = 1; i <= param.count; i++) {
            if (process.env[param.ipEnvName + i]) {
                wstream.write('        {\n');
                wstream.write('                 "host": "'+process.env[param.ipEnvName + i]+'",\n');
                wstream.write('                 "port": '+(process.env[param.portEnvName + i] || param.portDefault)+'\n');
                if (i === param.count)
                    wstream.write('        }\n');
                else
                    wstream.write('        },\n');
            }
            else
                console.log("Unable to find environment variable " + param.ipEnvName + i);
        }

        wstream.write('    ],\n');
        wstream.write('    "credentials": null,\n');
        wstream.write('    "URLParam": {\n');
        wstream.write('        "connectTimeoutMS": 0,\n');
        wstream.write('        "socketTimeoutMS": 0,\n');
        wstream.write('        "maxPoolSize": 5,\n');
        wstream.write('        "wtimeoutMS": 0,\n');
        wstream.write('        "slaveOk": true\n');
        wstream.write('    },\n');
        wstream.write('    "extraParam": {\n');
        wstream.write('        "db": {\n');
        wstream.write('            "native_parser": true\n');
        wstream.write('       },\n');
        wstream.write('       "server": {\n');
        wstream.write('            "auto_reconnect": true\n');
        wstream.write('        }\n');
        wstream.write('    }\n');
        wstream.write('};\n');

        wstream.end();
        return cb(null);
    },
    "writeReplica": function (param, cb) {
        console.log("writing replica profile @" + param.loc);
        var wstream = fs.createWriteStream(param.loc + param.profileFileName);

        wstream.write('\'use strict\';\n');
        wstream.write('module.exports = {\n');
        wstream.write('    "name": "core_provision",\n');
        wstream.write('    "prefix": "",\n');
        wstream.write('    "servers": [\n');

        for (var i = 1; i <= param.count; i++) {
            if (process.env[param.ipEnvName + i]) {
                wstream.write('        {\n');
                wstream.write("  server " + process.env[param.ipEnvName + i] + ":" + (process.env[param.portEnvName + i] || param.portDefault) + ";\n");
                if (i === param.count)
                    wstream.write('        }\n');
                else
                    wstream.write('        },\n');
            }
            else
                console.log("Unable to find environment variable " + param.ipEnvName + i);
        }

        wstream.write('    ],\n');
        wstream.write('    "credentials": null,\n');
        wstream.write('    "URLParam": {\n');
        wstream.write('        "connectTimeoutMS": 0,\n');
        wstream.write('        "socketTimeoutMS": 0,\n');
        wstream.write('        "maxPoolSize": 5,\n');
        wstream.write('        "wtimeoutMS": 0,\n');
        wstream.write('        "slaveOk": true\n');
        wstream.write('    },\n');
        wstream.write('    "extraParam": {\n');
        wstream.write('        "db": {\n');
        wstream.write('            "native_parser": true,\n');
        wstream.write('            "w": "majority"\n');
        wstream.write('       },\n');
        wstream.write('       "server": {\n');
        wstream.write('            "ha": true,\n');
        wstream.write('            "readPreference": "secondaryPreferred",\n');
        wstream.write('            "rs_name": param.rsName\n');
        wstream.write('        }\n');
        wstream.write('    }\n');
        wstream.write('};\n');

        wstream.end();
        return cb(null);
    }
};

if (mongoNb === 1) {
    lib.writeSingle({
        "profileFileName": 'profile.js',
        "loc": profileLocation,
        "count": mongoNb,
        "ipEnvName": "SOAJS_MONGO_IP_",
        "portEnvName": "SOAJS_MONGO_PORT_",
        "portDefault": 27017
    }, function (err) {
        console.log("PROFILE SINGLE DONE.");
    });
} else if (mongoNb > 1) {
    lib.writeReplica({
        "profileFileName": 'profile.js',
        "loc": profileLocation,
        "count": mongoNb,
        "ipEnvName": "SOAJS_MONGO_IP_",
        "portEnvName": "SOAJS_MONGO_PORT_",
        "portDefault": 27017,
        "rsName": mongoRsName
    }, function (err) {
        console.log("PROFILE REPLICA DONE.");
    });
} else {
    console.log("PROFILE CREATION FAILED. Environment variable SOAJS_MONGO_NB must be integer [" + mongoNb + "]");
}

