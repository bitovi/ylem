var ReactComponent = require("react").Component;
var DefineMap = require("can-define/map/map");
var assign = require("can-util/js/assign/assign");
var Observer = require("./observer");
var makeEnumerable = require("./make-enumerable");
var dev = require("can-util/js/dev/dev");


function Component() {
	ReactComponent.call(this);

	if (this.constructor.ViewModel && !makeEnumerable.isEnumerable(this.constructor.ViewModel)) {
		makeEnumerable(this.constructor.ViewModel, true);
	}

	this._observer = new Observer();

	if (typeof this.shouldComponentUpdate === "function") {
		this._shouldComponentUpdate = this.shouldComponentUpdate;
	}
	this.shouldComponentUpdate = function () { return false; };

	//!steal-remove-start
	if (process.env.NODE_ENV !== "production") {
		if (!this.constructor.ViewModel) {
			dev.warn('The ReactViewModel Component ' + this.constructor.name + ' was created without a ViewModel.');
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
				throw new Error('super.' + method + '() must be called on ' + this.constructor.name + '.');
			}
		}.bind(this));
	}
	//!steal-remove-end
}

Component.prototype = Object.create(ReactComponent.prototype);

assign(Component.prototype, {
	constructor: Component,

	componentWillReceiveProps: function(nextProps) {
		// TODO: check if unchange props overwrite viewModel changes
		this.viewModel.set( nextProps );
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


module.exports = function reactViewModel(displayName, ViewModel, render) {
	if (arguments.length === 1) {
		render = arguments[0];
		ViewModel = null;
		displayName = null;
	}
	if (arguments.length === 2) {
		render = arguments[1];

		if (typeof arguments[0] === "string") {
			displayName = arguments[0];
			ViewModel = null;
		}
		else {
			ViewModel = arguments[0];
			displayName = null;
		}
	}
	if (!displayName) {
		displayName = (render.displayName || render.name || "ReactVMComponent" ) + 'Wrapper';
	}

	function App() {
		Component.call(this);
	}

	App.ViewModel = ViewModel;
	App.displayName = displayName;

	App.prototype = Object.create(Component.prototype);

	assign(App.prototype, {
		constructor: App,

		render: function() {
			return render(this.viewModel);
		}
	});

	try {
		Object.defineProperty(App, "name", {
			writable: false,
			enumerable: false,
			configurable: true,
			value: displayName
		});
	}
	catch(e) {
		//
	}

	return App;
};

module.exports.Component = Component;
