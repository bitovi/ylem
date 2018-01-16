var namespace = require("can-namespace");

var connect = require("./connect").default;

module.exports = namespace.reactViewModel = {
	connect: connect,
};
