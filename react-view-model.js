var ReactComponent = require("react").Component;
var DefineMap = require("can-define/map/map");
var Observer = require("./observer");
var makeEnumerable, { isEnumerable } = require("./make-enumerable");
var dev = require("can-util/js/dev/dev");

class Component extends ReactComponent {
	constructor() {
		super();

		if (this.constructor.ViewModel && !isEnumerable(this.constructor.ViewModel)) {
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

	componentWillReceiveProps(nextProps) {
		// TODO: check if unchange props overwrite viewModel changes
		this.viewModel.set( nextProps );
	}

	componentWillMount() {
		var ViewModel = this.constructor.ViewModel || DefineMap;
		this.viewModel = new ViewModel( this.props );

		this._observer.startLisening(function () {
			if (typeof this._shouldComponentUpdate !== "function" || this._shouldComponentUpdate()) {
				this.forceUpdate();
			}
		}.bind(this));
	}

	componentDidMount() {
		this._observer.stopListening();
	}

	componentWillUpdate() {
		this._observer.startLisening();
	}

	componentDidUpdate() {
		this._observer.stopListening();
	}

	componentWillUnmount() {
		this._observer.stop();
		this.viewModel = null;
	}
}

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

	class App extends Component {
		static get name() { return displayName; }

		render() {
			return render(this.viewModel);
		}
	}

	App.ViewModel = ViewModel;
	App.displayName = displayName;

	return App;
};

module.exports.Component = Component;
