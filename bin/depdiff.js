#!/usr/bin/env node
/*jshint maxlen:180 */
"use strict";

var fs = require("fs");
var _ = require("lodash");
var depdiff = require("../lib");

var actions = module.exports = {
    displayHelp: function () {
        process.stderr.write(
            "Usage: depdiff <command>\n" +
            "\n" +
            "Available commands:\n" +
            "  help                             Displays this message.\n" +
            "  list-dependencies                Prints the list of package information into stdout as JSON.\n" +
            "  list-changes <old-package-path>  Prints the list of package changes between current and old version (as provided by the JSON in the old-package-path).\n"
        );
    },

    listDependencies: function () {
        process.stdout.write(JSON.stringify(depdiff.listDependencies()));
    },

    listChanges: function (filepath) {
        var oldDependencies = JSON.parse(fs.readFileSync(filepath));
        var newDependencies = depdiff.listDependencies();
        var changes = depdiff.listChanges(oldDependencies, newDependencies);
        _.each(changes, function (change) {
          var sign = change.type === "old" ? "-" : "+";
          process.stdout.write(sign + " " + change.path + " (" + change.version + ")\n");
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
    var command = process.argv[2];

    if ( !_.has(availableCommands, command) ) {
        process.stderr.write("Command not found: `" + command + "`\n");
        process.exit(1);
    }

    availableCommands[command].apply(null, process.argv.slice(3));
}
