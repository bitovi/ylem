import React, { Component as ReactComponent } from 'react';
import ReactDOM from 'react-dom';
import compute from 'can-compute';
import DefineMap from 'can-define/map/map';
import Scope from 'can-view-scope';
import Observer from './observer';
import makeEnumerable, { isEnumerable } from './make-enumerable';
import dev from 'can-util/js/dev/dev';

export class Component extends ReactComponent {
	constructor() {
		super();

		if (this.constructor.ViewModel && !isEnumerable(this.constructor.ViewModel)) {
			makeEnumerable(this.constructor.ViewModel, true);
		}

		this._observer = new Observer();

		if (typeof this.shouldComponentUpdate === 'function') {
			this._shouldComponentUpdate = this.shouldComponentUpdate;
		}
		this.shouldComponentUpdate = () => false;

		//!steal-remove-start
		if (process.env.NODE_ENV !== "production") {
			if (!this.constructor.ViewModel) {
				dev.warn(`The ReactViewModel Component ${ this.constructor.name } was created without a ViewModel.`);
			}

			let methods = [
				'componentWillReceiveProps',
				'componentWillMount',
				'componentDidMount',
				'componentWillUpdate',
				'componentDidUpdate',
				'componentWillUnmount',
			];

			methods.forEach((method) => {
				let methodAsString = this[method].toString();
				if (
					this[method] !== Component.prototype[method]
					&& !methodAsString.includes(method, methodAsString.indexOf(') {'))
				) {
					throw new Error(`super.${ method }() must be called on ${ this.constructor.name }.`);
				}
			});
		}
		//!steal-remove-end
	}

	get props() {
		return this.viewModel;
	}

	set props(value) {
		this._props = value;
	}

	componentWillReceiveProps(nextProps) {
		this.viewModel.set( nextProps );
	}

	componentWillMount() {
		const ViewModel = this.constructor.ViewModel || DefineMap;
		this.viewModel = new ViewModel( this._props );

		this._observer.startLisening(() => {
			if (typeof this._shouldComponentUpdate !== 'function' || this._shouldComponentUpdate()) {
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

export function reactViewModel(displayName, ViewModel, App) {
	if (arguments.length === 1) {
		App = arguments[0];
		ViewModel = null;
		displayName = `${ App.displayName || App.name || 'ReactVMComponent' }Wrapper`;
	}
	if (arguments.length === 2) {
		App = arguments[1];

		if (typeof arguments[0] === 'string') {
			displayName = arguments[0];
			ViewModel = null;
		}
		else {
			ViewModel = arguments[0];
			displayName = `${ App.displayName || App.name || ViewModel.name || 'ReactVMComponent' }Wrapper`;
		}
	}

	if (!(App.prototype instanceof Component)) {
		if (App.prototype instanceof ReactComponent) {
			let Child = App;
			class Wrapper extends Component {
				static get name() { return displayName; }

				render() {
					return React.createElement(Child, this.props);
				}
			}
			Wrapper.ViewModel = ViewModel;
			Wrapper.displayName = displayName;

			App = Wrapper;
		}
		else {
			let render = App;
			class Wrapper extends Component {
				static get name() { return displayName; }

				render() {
					return render(this.props);
				}
			}
			Wrapper.ViewModel = ViewModel;
			Wrapper.displayName = displayName;

			App = Wrapper;
		}
	}

	return function(scope, options) {
		if ( !(scope instanceof Scope) ) {
			scope = Scope.refsScope().add(scope || {});
		}
		if ( !(options instanceof Scope.Options) ) {
			options = new Scope.Options(options || {});
		}

		var props = compute(function() {
			let props = {};
			scope._context.each(function (val, name) {
				props[name] = val;
			});

			return props;
		});

		const el = document.createElement('div');
		ReactDOM.render( <App {...props()} />, el);

		props.on('change', function(ev, newValue) {
			ReactDOM.render( <App {...newValue} />, el);
		});

		return el;
	};
}

export function makeReactComponent(displayName, CanComponent) {
	if (arguments.length === 1) {
		CanComponent = arguments[0];
		displayName = `${CanComponent.name || 'CanComponent'}Wrapper`;
	}

	class Wrapper extends ReactComponent {
		static get name() { return displayName; }

		constructor() {
			super();

			this.canComponent = null;
			this.createComponent = this.createComponent.bind(this);
		}

		createComponent(el) {
			if (this.canComponent) {
				this.canComponent = null;
			}

			if (el) {
				this.canComponent = new CanComponent(el, {
					subtemplate: null,
					templateType: 'react',
					parentNodeList: undefined,
					options: Scope.refsScope().add({}),
					scope: new Scope.Options({}),
					setupBindings: (el, makeViewModel, initialViewModelData) => {
						Object.assign(initialViewModelData, this.props);
						makeViewModel(initialViewModelData);
					},
				});
			}
		}

		componentWillUpdate(props) {
			this.canComponent.viewModel.set(props);
		}

		render() {
			return React.createElement(CanComponent.prototype.tag, {
				ref: this.createComponent,
			});
		}
	}
	Wrapper.displayName = displayName;

	return Wrapper;
}

export default reactViewModel;
