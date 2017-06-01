import { Component as ReactComponent } from "react";
import DefineMap from "can-define/map/map";
import Observer from "./observer";
import makeEnumerable, { isEnumerable } from "./make-enumerable";
import dev from "can-util/js/dev/dev";

export class Component extends ReactComponent {
	constructor() {
		super();

		if (this.constructor.ViewModel && !isEnumerable(this.constructor.ViewModel)) {
			makeEnumerable(this.constructor.ViewModel, true);
		}

		this._observer = new Observer();

		if (typeof this.shouldComponentUpdate === "function") {
			this._shouldComponentUpdate = this.shouldComponentUpdate;
		}
		this.shouldComponentUpdate = () => false;

		//!steal-remove-start
		if (process.env.NODE_ENV !== "production") {
			if (!this.constructor.ViewModel) {
				dev.warn(`The ReactViewModel Component ${ this.constructor.name } was created without a ViewModel.`);
			}

			let methods = [
				"componentWillReceiveProps",
				"componentWillMount",
				"componentDidMount",
				"componentWillUpdate",
				"componentDidUpdate",
				"componentWillUnmount",
			];

			methods.forEach((method) => {
				let methodAsString = this[method].toString();
				if (
					this[method] !== Component.prototype[method]
					&& !methodAsString.includes(method, methodAsString.indexOf(") {"))
				) {
					throw new Error(`super.${ method }() must be called on ${ this.constructor.name }.`);
				}
			});
		}
		//!steal-remove-end
	}

	componentWillReceiveProps(nextProps) {
		// TODO: check if unchange props overwrite viewModel changes
		this.viewModel.set( nextProps );
	}

	componentWillMount() {
		const ViewModel = this.constructor.ViewModel || DefineMap;
		this.viewModel = new ViewModel( this.props );

		this._observer.startLisening(() => {
			if (typeof this._shouldComponentUpdate !== "function" || this._shouldComponentUpdate()) {
				this.forceUpdate();
			}
		});
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

export default function reactViewModel(displayName, ViewModel, render) {
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
		displayName = `${ render.displayName || render.name || "ReactVMComponent" }Wrapper`;
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
}
