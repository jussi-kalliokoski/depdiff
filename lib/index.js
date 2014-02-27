"use strict";

var glob = require("glob");
var fs = require("fs");
var path = require("path");
var _ = require("lodash");

var assignProperty = function (propertyName, propertyValue, object) {
    object[propertyName] = propertyValue;
};

module.exports = {
    listDependencies: function (options) {
        var cwd = (options && options.cwd) || "";
        return glob.sync("**/{package,bower}.json", options).map(function (filepath) {
            var fullPath = path.join(cwd, filepath);
            var packageJson = JSON.parse(fs.readFileSync(fullPath));
            return {
                path: filepath,
                version: packageJson.version
            };
        });
    },

    listChanges: function (oldDependencies, newDependencies) {
        _.each(oldDependencies, assignProperty.bind(null, "type", "old"));
        _.each(newDependencies, assignProperty.bind(null, "type", "new"));
        var dependencies = _.sortBy(oldDependencies.concat(newDependencies), ["path", "type"]);
        return _.uniq(dependencies, true, function (dependency) {
            return JSON.stringify(_.pick(dependency, ["path", "version"]));
        });
    },
};
