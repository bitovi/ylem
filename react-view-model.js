var namespace = require('can-namespace');

var connect = require('./connect');
var ObservableComponent = require('./observable-component');

module.exports = namespace.reactViewModel = {
	connect: connect,
	ObservableComponent: ObservableComponent,
};
