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
                var deployment = "manual";
                var ip = args[2] || "127.0.0.1";
                var devmachineIP = ip;
                if (args[3]){
                    if (args[3] === "DOCKER") {
                        deployment = "docker";
                    }
                    else if (args[3] === "DOCKERMACHINE"){
                        deployment = "dockermachine";
                        devmachineIP = args[4];
                    }
                }

                var mongoFile = config.dataFolder + args[1] + "/data.js";
                fs.stat(mongoFile, function (err, stats) {
                    if (err) throw err;
                    fs.readFile(mongoFile, 'utf8', function (err, data) {
                        if (err) throw err;

                        var tmpData = config.dataFolder + args[1] + "/data-tmp.js";
                        var wstream = fs.createWriteStream(tmpData);
                        if (deployment === "docker") {
                            wstream.write("var docker = true;" + os.EOL);
                            wstream.write("var machine = false;" + os.EOL);
                            wstream.write("var mongoIP = '" + ip + "';" + os.EOL);
                            wstream.write("var devMongoIP = '" + devmachineIP + "';" + os.EOL);
                        }
                        else if (deployment === "dockermachine") {
                            wstream.write("var docker = false;" + os.EOL);
                            wstream.write("var machine = true;" + os.EOL);
                            wstream.write("var mongoIP = '" + ip + "';" + os.EOL);
                            wstream.write("var devMongoIP = '" + devmachineIP + "';" + os.EOL);
                        }
                        else {
                            wstream.write("var docker = false;" + os.EOL);
                            wstream.write("var machine = false;" + os.EOL);
                            wstream.write("var mongoIP = '" + ip + "';" + os.EOL);
                            wstream.write("var devMongoIP = '" + devmachineIP + "';" + os.EOL);
                        }
                        wstream.write(data);
                        wstream.end();

                        mongoFile = tmpData;
                        var execString = 'mongo --host ' + ip + ' ' + mongoFile;
                        console.log("About to run: " + execString);
                        shell.pushd(config.dataFolder + args[1] + "/");
                        shell.exec(execString, function (code, output) {
                            console.log("Done importing data: ", code);
                            fs.unlink(tmpData, function (err) {
                                if (err) console.log(err);
                                shell.popd();
                            });
                        });
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
        return console.log("Unkown command [" + process.argv[2] + "]");
    }
}

if (process.argv.length < 3)
    return console.log("You did not specify any command");

main(process.argv);