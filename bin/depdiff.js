#!/usr/bin/env node
/*jshint maxlen:180 */
"use strict";

var fs = require("fs");
var _ = require("lodash");
var depdiff = require("../lib");

var outputStream = process.stdout;

var write = function (data) {
    outputStream.write(data);
};

var actions = module.exports = {
    displayHelp: function () {
        process.stderr.write(
            "Usage: depdiff <command>\n" +
            "\n" +
            "Available commands:\n" +
            "  help                             Displays this message.\n" +
            "  list-dependencies                Prints the list of package information into stdout as JSON.\n" +
            "  list-changes <old-package-path>  Prints the list of package changes between current and old version (as provided by the JSON in the old-package-path).\n" +
            "\n" +
            "Options:\n" +
            "  -o, --output <file>              Prints the results into a file instead of stdout.\n" +
            "\n"
        );
    },

    listDependencies: function () {
        write(JSON.stringify(depdiff.listDependencies()));
    },

    listChanges: function (filepath) {
        var oldDependencies = JSON.parse(fs.readFileSync(filepath));
        var newDependencies = depdiff.listDependencies();
        var changes = depdiff.listChanges(oldDependencies, newDependencies);
        _.each(changes, function (change) {
            var sign = change.type === "old" ? "-" : "+";
            write(sign + " " + change.path + " (" + change.version + ")\n");
        });
    },
};

var availableCommands = {
    "help": actions.displayHelp,
    "--help": actions.displayHelp,
    "-h": actions.displayHelp,
    "list-dependencies": actions.listDependencies,
    "list-changes": actions.listChanges,
};

var isBeingRunAsAnExecutable = require.main === module;
if ( isBeingRunAsAnExecutable ) {
    var args = require("minimist")(process.argv.slice(3));
    var outputFile = args.o || args.output;
    if ( outputFile && typeof outputFile === "string" ) {
        outputStream = fs.createWriteStream(outputFile, {
            encoding: "utf8"
        });
    }
    var command = process.argv[2];

    if ( !_.has(availableCommands, command) ) {
        process.stderr.write("Command not found: `" + command + "`\n");
        process.exit(1);
    }

    availableCommands[command].apply(null, process.argv.slice(3));
}
