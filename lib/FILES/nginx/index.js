'use strict';
var fs = require('fs');


var controllerNb = process.env.SOAJS_NX_CONTROLLER_NB || 1;
var nxApiDomain = process.env.SOAJS_NX_API_DOMAIN || "api.soajs.org";
var nxApiPort = process.env.SOAJS_NX_API_PORT || "80";

var nxSiteDomain = process.env.SOAJS_NX_SITE_DOMAIN;
var nxSitePort = process.env.SOAJS_NX_SITE_PORT || "80";
var nxSitePath = process.env.SOAJS_NX_SITE_PATH || "/opt/soajs/dashboard";

var nxOs = process.env.SOAJS_NX_OS || "ubuntu";
var nxLocation = process.env.SOAJS_NX_LOC || "/etc/nginx";

var lib = {
    "writeUpstream": function (param, cb) {
        console.log("writing upstream.conf in " + param.loc);
        var wstream = fs.createWriteStream(param.loc + 'upstream.conf');
        wstream.write("upstream " + param.upstreamName + " {\n");
        for (var i = 1; i <= param.count; i++) {
            if (process.env[param.ipEnvName + i])
                wstream.write("  server " + process.env[param.ipEnvName] + i + ":" + param.port + ";\n");
            else
                console.log("Unable to find environment variable " + param.ipEnvName + i);
        }
        wstream.write("}\n");
        wstream.end();
        return cb(null);
    },
    "writeApiConf": function (param, cb) {
        console.log("writing api conf in " + param.loc + " " + param.confFileName);
        var wstream = fs.createWriteStream(param.loc + param.confFileName);
        wstream.write("server {\n");
        wstream.write("  listen       " + param.port + ";\n");
        wstream.write("  server_name  " + param.domain + ";\n");
        wstream.write("  client_max_body_size 100m;\n");
        wstream.write("  location / {\n");
        wstream.write("    proxy_pass 		    http://" + param.upstreamName + ";\n");
        wstream.write("    proxy_set_header   	X-Forwarded-Proto 	    $scheme;\n");
        wstream.write("    proxy_set_header   	Host             		$http_host;\n");
        wstream.write("    proxy_set_header   	X-NginX-Proxy     	    true;\n");
        wstream.write("    proxy_set_header   	Connection        	    \"\";\n");
        wstream.write("  }\n");
        wstream.write("}\n");
        wstream.end();
        return cb(null);
    },
    "writeSiteConf": function (param, cb) {
        console.log("writing site conf in " + param.loc + " " + param.confFileName);
        var wstream = fs.createWriteStream(param.loc + param.confFileName);
        wstream.write("server {\n");
        wstream.write("  server_name  " + param.domain + ";\n");
        wstream.write("  client_max_body_size 100m;\n");
        wstream.write("  location / {\n");
        wstream.write("    root  " + param.path + ";\n");
        wstream.write("    sendfile       off;\n");
        wstream.write("    index  index.html index.htm;\n");
        wstream.write("  }\n");
        wstream.write("}\n");
        wstream.end();
        return cb(null);
    }
};


lib.writeUpstream({
    "loc": nxLocation + ((nxOs === 'mac') ? "/servers/" : ( nxOs === 'ubuntu') ? "/conf.d/" : "/nginx/"),
    "port": "4000",
    "ipEnvName": "SOAJS_NX_CONTROLLER_IP_",
    "upstreamName": "soajs.controller",
    "count": controllerNb
}, function (err) {
    console.log("NGINX UPSTREAM DONE.");
});

lib.writeApiConf({
    "loc": nxLocation + ((nxOs === 'mac') ? "/servers/" : ( nxOs === 'ubuntu') ? "/sites-enabled/" : "/nginx/"),
    "confFileName": "api.conf",
    "port": nxApiPort,
    "domain": nxApiDomain,
    "upstreamName": "soajs.controller"
}, function (err) {
    console.log("NGINX API CONF DONE.");
});

if (nxSiteDomain) {
    lib.writeDashConf({
        "loc": nxLocation + ((nxOs === 'mac') ? "/servers/" : ( nxOs === 'ubuntu') ? "/sites-enabled/" : "/nginx/"),
        "confFileName": "dash.conf",
        "domain": nxSiteDomain,
        "port": nxSitePort,
        "path": nxSitePath
    }, function (err) {
        console.log("NGINX DASH CONF DONE.");
    });
}