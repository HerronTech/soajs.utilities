'use strict';
var shell = require('shelljs');
var config = require("./config.js");
var fs = require("fs");


var lib = {
    assure_deploy_env_path: function (arg) {
        if (arg[0] === "/")
            arg = arg.substr(1);
        if (arg[arg.length - 1] === "/")
            arg = arg.substr(0, arg.length - 1);
        return arg;
    },
    assure_path: function (arg, cb) {
        if (arg[arg.length - 1] === "/")
            arg = arg.substr(0, arg.length - 1);
        fs.stat(arg, function (err, stats) {
            if (err) throw err;
            return cb(arg);
        });
    },
    assure_profiles: function (arg, cb) {
        fs.stat(arg, function (err, stats) {
            if (err) throw err;
            return cb();
        });
    },
    buildImage: function (buildFolder, serviceInfo, serviceSrc, profilesSrc, docker_tpl, prefix, cb) {
        shell.mkdir(buildFolder);
        shell.pushd(buildFolder);
        shell.mkdir("FILES");
        shell.cp('-R', serviceSrc, "./FILES/" + serviceInfo.folder)
        shell.cp('-R', profilesSrc, "./FILES/profiles");
        var wstream = fs.createWriteStream('Dockerfile');
        wstream.write(docker_tpl.from + "\n");
        wstream.write(docker_tpl.maintainer + "\n");
        for (var i = 0; i < docker_tpl.body.length; i++) {
            var str = docker_tpl.body[i].replace(/#SERVICEFOLDERNAME#/g, serviceInfo.folder);
            if (serviceInfo.ports)
                str = str.replace(/#SERVICEPORT#/g, serviceInfo.ports);
            wstream.write(str + "\n");
        }
        wstream.end();
        var label = "";
        if (prefix && prefix !== "")
            label = prefix;
        label = label + serviceInfo.name;
        var execString = 'docker build -t ' + label + ' .';
        console.log("About to run: " + execString);

        //shell.popd();
        //return cb(label);

        shell.exec(execString, function (code, output) {
            shell.popd();
            shell.rm('-rf', buildFolder);
            cb(label);
        });
    }
};

var _CMD = {
    "docker": {
        "exec": function (args) {
            if (args && args.length > 1) {
                if (_CMD.docker[args[1]]) {
                    args.shift();
                    _CMD.docker[args[0]](args);
                }
                else
                    return console.log("Unkown Operation [" + args[1] + "]");
            }
            else
                return console.log("Command [docker] needs an operation")
        },
        "help": function (args) {
            console.log("docker buildImage <PATH>");
            console.log("docker soajsLocal <PROFILE_PATH> <SERVICE_FOLDER>");
            console.log("docker soajsLocal <PROFILE_PATH> <SOAJS_FOLDER>");
        },
        "buildImage": function (args) {
            if (args && args.length > 1) {
                args[1] = lib.assure_deploy_env_path(args[1]);
                var dockerFile = config.imagesFolder + args[1] + "/Dockerfile";
                var soajsConfFile = config.imagesFolder + args[1] + "/soajs.conf.js";
                fs.stat(dockerFile, function (err, stats) {
                    if (err) throw err;
                    fs.stat(soajsConfFile, function (err, stats) {
                        var deleteProfiles = false;
                        var build = function () {
                            var label = "";
                            if (config.repositoryPrefix && config.repositoryPrefix !== "")
                                label = config.repositoryPrefix;
                            label = label + args[1].replace(/\//g, "_");
                            var execString = 'docker build -t ' + label + ' .';
                            console.log("About to run: " + execString);
                            shell.pushd(config.imagesFolder + args[1] + "/");
                            shell.exec(execString, function (code, output) {
                                if (deleteProfiles)
                                    shell.rm('-rf', soajsConf.profiles, config.imagesFolder + args[1] + "/FILES/profiles");
                                shell.popd();
                            });
                        };
                        if (!err) {
                            delete require.cache[require.resolve(soajsConfFile)];
                            var soajsConf = require(soajsConfFile);
                            if (soajsConf.profiles) {
                                var profilesFolder = config.imagesFolder + soajsConf.profiles;
                                fs.stat(profilesFolder, function (err, stats) {
                                    if (err) throw err;
                                    shell.cp('-R', config.imagesFolder + soajsConf.profiles, config.imagesFolder + args[1] + "/FILES/profiles");
                                    deleteProfiles = true;
                                    return build();
                                });
                            }
                            else
                                return build();
                        }
                        else
                            return build();
                    });
                });
            }
            else
                return console.log("Operation [buildImage] needs arguments");
        },
        "serviceLocal": function (args) {
            if (args && args.length > 2) {
                args[1] = lib.assure_deploy_env_path(args[1]);
                var profilesFolder = config.imagesFolder + args[1] + "/profiles";
                lib.assure_profiles(profilesFolder, function () {
                    lib.assure_path(args[2], function (arg) {
                        var serviceFolderName = "";
                        var index = arg.lastIndexOf("/");
                        if (index !== -1)
                            serviceFolderName = arg.substr(index + 1);
                        else
                            serviceFolderName = arg;
                        var tmpConfig = {};
                        if (serviceFolderName === "soajs.controller") {
                            tmpConfig = {"servicePort": 4000, "serviceName": "controller"};
                        }
                        else {
                            delete require.cache[require.resolve(arg + "/config.js")];
                            tmpConfig = require(arg + "/config.js");
                        }
                        if (tmpConfig.servicePort && tmpConfig.serviceName) {
                            lib.buildImage(
                                config.imagesFolder + tmpConfig.serviceName,
                                {
                                    "name": tmpConfig.serviceName,
                                    "folder": serviceFolderName,
                                    "ports": tmpConfig.servicePort + " " + (tmpConfig.servicePort + config.port.maintenanceInc)
                                },
                                arg + "/",
                                profilesFolder + "/",
                                config.dockerfile_tpl,
                                config.repositoryPrefix, function (label) {
                                    console.log("Done. You can run the container as follow:");
                                    console.log("docker run -i -t --link [dataProxy:soajsmongo] -P " + label+" /bin/bash");
                                });
                        }
                        else
                            console.log("You need to have servicePort as well as serviceName in [" + arg + "/config.js]");
                    });
                });
            }
            else
                return console.log("Operation [myServiceImage] needs arguments");
        },
        "soajsLocal": function (args) {
            if (args && args.length > 2) {
                args[1] = lib.assure_deploy_env_path(args[1]);
                var profilesFolder = config.imagesFolder + args[1] + "/profiles";
                lib.assure_profiles(profilesFolder, function () {
                    lib.assure_path(args[2], function (arg) {
                        lib.buildImage(
                            config.imagesFolder + "soajs",
                            {
                                "name": "soajs",
                                "folder": "soajs"
                            },
                            arg + "/",
                            profilesFolder + "/",
                            config.soajs_dockerfile_tpl,
                            config.repositoryPrefix, function (label) {
                                console.log("Done. You can run the container as follow:");
                                console.log("docker run -i -t " + label);
                            });
                    });
                });
            }
        }
    },

    "data": {
        "exec": function (args) {
            if (args && args.length > 1) {
                if (_CMD.data[args[1]]) {
                    args.shift();
                    _CMD.data[args[0]](args);
                }
                else
                    return console.log("Unkown Operation [" + args[1] + "]");
            }
            else
                return console.log("Command [data] needs an operation")
        },
        "help": function (args) {
            console.log("data import <PATH> [IP]");
        },
        "import": function (args) {
            if (args && args.length > 1) {
                if (args[1][0] === "/")
                    args[1] = args[1].substr(1);
                if (args[1][args[1].length - 1] === "/")
                    args[1] = args[1].substr(0, args[1].length - 1);
                var ip = args[2] || "127.0.0.1";
                var mongoFile = config.dataFolder + args[1] + "/data.js";
                fs.stat(mongoFile, function (err, stats) {
                    if (err) throw err;
                    var execString = 'mongo --host ' + ip + ' ' + mongoFile;
                    console.log("About to run: " + execString);
                    shell.pushd(config.dataFolder + args[1] + "/");
                    shell.exec(execString, function (code, output) {
                        console.log("Done importing data: ", code);
                        shell.popd();
                    });
                });
            }
            else
                return console.log("Operation [import] needs arguments");
        }
    }
};

function main(args) {
    if (_CMD[args[2]]) {
        args.shift();
        args.shift();
        _CMD[args[0]].exec(args);
    }
    else {
        return console.log("Unkown command [" + process.argv[2] + "]")
    }
}

if (process.argv.length < 3)
    return console.log("You did not specify any command");

main(process.argv);