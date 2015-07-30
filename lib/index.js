'use strict';
var shell = require('shelljs');
var config = require("./config.js");
var fs = require("fs");
var os = require('os');

var lib = {};

var _CMD = {
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
                return console.log("Command [data] needs an operation");
        },
        "help": function (args) {
            console.log("data import <PATH> [IP] [DOCKER]");
        },
        "import": function (args) {
            if (args && args.length > 1) {
                if (args[1][0] === "/")
                    args[1] = args[1].substr(1);
                if (args[1][args[1].length - 1] === "/")
                    args[1] = args[1].substr(0, args[1].length - 1);
                var dockerDeploy = false;
                if (args[3] && args[3] === "DOCKER")
                    dockerDeploy = true;
                var ip = args[2] || "127.0.0.1";
                var mongoFile = config.dataFolder + args[1] + "/data.js";
                console.log(args, dockerDeploy)
                var resume = function (tmpData) {
                    var execString = 'mongo --host ' + ip + ' ' + mongoFile;
                    console.log("About to run: " + execString);
                    shell.pushd(config.dataFolder + args[1] + "/");
                    shell.exec(execString, function (code, output) {
                        console.log("Done importing data: ", code);
                        if (tmpData) {
                            fs.unlink(tmpData, function (err) {
                                if (err) console.log(err);
                                shell.popd();
                            });
                        }
                        else
                            shell.popd();
                    });
                };
                fs.stat(mongoFile, function (err, stats) {
                    if (err) throw err;
                    if (dockerDeploy) {
                        fs.readFile(mongoFile, 'utf8', function (err, data) {
                            if (err) throw err;
                            var tmpData = config.dataFolder + args[1] + "/data-tmp.js";
                            var wstream = fs.createWriteStream(tmpData);
                            wstream.write("var docker = true;" + os.EOL);
                            wstream.write(data);
                            wstream.end();
                            mongoFile = tmpData;
                            resume(tmpData);
                        });
                    }
                    else
                        resume(null);
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
        return console.log("Unkown command [" + process.argv[2] + "]");
    }
}

if (process.argv.length < 3)
    return console.log("You did not specify any command");

main(process.argv);