var React = require("react");
var canReflect = require("can-reflect");
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

		var observer = function () {
			if (typeof this._shouldComponentUpdate !== "function" || this._shouldComponentUpdate()) {
				this.forceUpdate();
			}
		}.bind(this);

		//!steal-remove-start
		Object.defineProperty(observer, "name", {
			value: canReflect.getName(this),
		});
		//!steal-remove-end

		this._observer = new Observer(observer);

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
	Component.prototype.constructor = Component;

	assign(Component.prototype, {
		constructor: Component,

		componentWillReceiveProps: function(nextProps) {
			var props = {};

			for (var key in nextProps) {
				if (!(key in this.props) || nextProps[key] !== this.props[key]) {
					props[key] = nextProps[key];
				}
			}

			this._observer.ignore(function () {
				this.viewModel.assign(props);
			}.bind(this));
		},

		componentWillMount: function() {
			var ViewModel = this.constructor.ViewModel || DefineMap;
			this.viewModel = new ViewModel( this.props );

			this._observer.startRecording();
		},

		componentDidMount: function() {
			this._observer.stopRecording();
		},

		componentWillUpdate: function() {
			this._observer.startRecording();
		},

		componentDidUpdate: function() {
			this._observer.stopRecording();
		},

		componentWillUnmount: function() {
			this._observer.teardown();
			this.viewModel = null;
		},
	});

	//!steal-remove-start
	canReflect.assignSymbols(Component.prototype, {
		"can.getName": function() {
			return canReflect.getName(this.constructor) + "{}";
		},
	});
	//!steal-remove-end

	module.exports = namespace.ReactViewModelComponent = Component;
}
else {
	module.exports = namespace.ReactViewModelComponent = function Component() {
		throw new Error("You must provide React before can.all.js");
	};
}
