var React = require("react");
var DefineMap = require("can-define/map/map");
var assign = require("can-util/js/assign/assign");
var Observer = require("./observer");
var makeEnumerable = require("./helpers/make-enumerable");
var autobindMethods = require("./helpers/autobind-methods");
var dev = require("can-util/js/dev/dev");
var namespace = require("can-namespace");

if (React) {
	var Component = function Component() {
		React.Component.call(this);

		if (this.constructor.ViewModel) {
			autobindMethods(this.constructor.ViewModel, true);
			makeEnumerable(this.constructor.ViewModel, true);
		}

		this._observer = new Observer();

		if (typeof this.shouldComponentUpdate === "function") {
			this._shouldComponentUpdate = this.shouldComponentUpdate;
		}
		this.shouldComponentUpdate = function () { return false; };

		//!steal-remove-start
		if (typeof process === "undefined" || process.env.NODE_ENV !== "production") {
			if (!this.constructor.ViewModel) {
				dev.warn("The ReactViewModel Component " + this.constructor.name + " was created without a ViewModel.");
			}

			var methods = [
				"componentWillReceiveProps",
				"componentWillMount",
				"componentDidMount",
				"componentWillUpdate",
				"componentDidUpdate",
				"componentWillUnmount",
			];

			methods.forEach(function (method) {
				var methodAsString = this[method].toString();
				if (
					this[method] !== Component.prototype[method]
					&& !methodAsString.includes(method, methodAsString.indexOf(") {"))
				) {
					throw new Error("super." + method + "() must be called on " + this.constructor.name + ".");
				}
			}.bind(this));
		}
		//!steal-remove-end
	};

	Component.prototype = Object.create(React.Component.prototype);

	assign(Component.prototype, {
		constructor: Component,

		componentWillReceiveProps: function(nextProps) {
			var props = {};

			for (var key in nextProps) {
				if (!(key in this.props) || nextProps[key] !== this.props[key]) {
					props[key] = nextProps[key];
				}
			}

			this.viewModel.assign(props);
		},

		componentWillMount: function() {
			var ViewModel = this.constructor.ViewModel || DefineMap;
			this.viewModel = new ViewModel( this.props );

			this._observer.startLisening(function () {
				if (typeof this._shouldComponentUpdate !== "function" || this._shouldComponentUpdate()) {
					this.forceUpdate();
				}
			}.bind(this));
		},

		componentDidMount: function() {
			this._observer.stopListening();
		},

		componentWillUpdate: function() {
			this._observer.startLisening();
		},

		componentDidUpdate: function() {
			this._observer.stopListening();
		},

		componentWillUnmount: function() {
			this._observer.stop();
			this.viewModel = null;
		},
	});

	module.exports = namespace.ReactViewModelComponent = Component;
}
else {
	module.exports = namespace.ReactViewModelComponent = function Component() {
		throw new Error("You must provide React before can.all.js");
	};
}
