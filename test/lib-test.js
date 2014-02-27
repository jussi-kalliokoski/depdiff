"use strict";

var path = require("path");
var fs = require("fs");
var chai = require("chai");
var _ = require("lodash");
var depdiff = require("../lib");

var fixtureDir = path.join(__dirname, "fixtures");

describe("lib", function () {
    describe(".listDependencies()", function () {
        it("should return the list of dependencies and their versions", function () {
            var dependencies = depdiff.listDependencies({
                cwd: path.join(fixtureDir, "project")
            });

            _.find(dependencies, {
                "path": "node_modules/foo/package.json",
                "version": "2.5.1"
            }).should.be.an("object");

            _.find(dependencies, {
                "path": "node_modules/bar/bower.json",
                "version": "5.1.52"
            }).should.be.an("object");

            _.find(dependencies, {
                "path": "node_modules/dog/package.json",
                "version": "4.2.7"
            }).should.be.an("object");
        });
    });

    describe(".listChanges()", function () {
        it("should return the list of changed dependencies", function () {
            var oldDependencies = JSON.parse(fs.readFileSync(path.join(fixtureDir, "old-list.json")));
            var newDependencies = depdiff.listDependencies({
                cwd: path.join(fixtureDir, "project")
            });

            var changes = depdiff.listChanges(oldDependencies, newDependencies);
            changes[0].path.should.equal("node_modules/bar/bower.json");
            changes[0].version.should.equal("5.1.52");
            changes[0].type.should.equal("new");
            changes[1].path.should.equal("node_modules/bar/bower.json");
            changes[1].version.should.equal("5.1.42");
            changes[1].type.should.equal("old");
            changes[2].path.should.equal("node_modules/cat/package.json");
            changes[2].version.should.equal("1.2.3");
            changes[2].type.should.equal("old");
            changes[3].path.should.equal("node_modules/dog/package.json");
            changes[3].version.should.equal("4.2.7");
            changes[3].type.should.equal("new");
            changes[4].path.should.equal("node_modules/foo/package.json");
            changes[4].version.should.equal("2.5.1");
            changes[4].type.should.equal("new");
        });
    });
});
