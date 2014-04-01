"use strict";

var glob = require("glob");
var fs = require("fs");
var path = require("path");
var _ = require("lodash");

var assignProperty = function (propertyName, propertyValue, object) {
    object[propertyName] = propertyValue;
};

var removeMatchingDependencies = function (dependencies) {
    for ( var i = 1; i < dependencies.length; i++ ) {
        var dependency = dependencies[i];
        var previousDependency = dependencies[i - 1];
        var dependenciesMatch = dependency.path === previousDependency.path && dependency.version === previousDependency.version;
        if ( dependenciesMatch ) {
            dependencies.splice(i - 1, 2);
            i -= 2;
        }
    }
};

module.exports = {
    listDependencies: function (options) {
        var cwd = (options && options.cwd) || "";
        return glob.sync("**/{package,bower}.json", options).map(function (filepath) {
            var fullPath = path.join(cwd, filepath);
            try {
                var packageJson = JSON.parse(fs.readFileSync(fullPath));
                return {
                    path: filepath,
                    version: packageJson.version
                };
            } catch (error) {
                return {
                    path: filepath,
                    version: "ERROR: " + error.message
                };
            }
        });
    },

    listChanges: function (oldDependencies, newDependencies) {
        _.each(oldDependencies, assignProperty.bind(null, "type", "old"));
        _.each(newDependencies, assignProperty.bind(null, "type", "new"));
        var dependencies = _.sortBy(oldDependencies.concat(newDependencies), ["path", "type"]);
        removeMatchingDependencies(dependencies);
        return dependencies;
    },
};
