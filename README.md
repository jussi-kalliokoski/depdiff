# depdiff

[![Build Status](https://travis-ci.org/jussi-kalliokoski/depdiff.png?branch=master)](https://travis-ci.org/jussi-kalliokoski/depdiff)
[![Coverage Status](https://img.shields.io/coveralls/jussi-kalliokoski/depdiff.svg)](https://coveralls.io/r/jussi-kalliokoski/depdiff)

I kept running into a problem where stuff I commited did not work on a build machine or someone else's computer, and quite often the problem turned out to be that my npm dependencies had changed.

To repair the issue, I made this small tool that allows you to keep track of those changes to immediately see what might have caused the issues.

## Installation

To install the CLI:

```sh
$ npm install -g depdiff
```

## Usage

The CLI features two commands, `list-dependencies` and `list-changes`. `list-dependencies` lists your dependencies as JSON, going through your `bower.json` and `package.json` files. `list-changes` takes a file of this JSON format and compares it to the current situation, showing a diff similar to what you might be used to in your version control.

To save the current state to a file:

```sh
$ depdiff list-dependencies > current-deps.json
```

To compare current state to an older state:

```sh
$ depdiff list-changes old-deps.json
```
