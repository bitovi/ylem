import observe from 'can-observe';
import canReflect from 'can-reflect';
import ObservableComponent from './observable-component';

import ReactDOM from 'react-dom';

const gdsfp = Symbol.for('ylem.component.gdsfp');

const makeDerive = (ctor) => {
	const oldDerive = ctor.getDerivedStateFromProps;

	ctor.getDerivedStateFromProps = (nextProps, state) => {
		if (oldDerive && oldDerive(nextProps, state) !== undefined) {
			console.warn('ylem: you should not return a value from getDerivedStateFromProps'); // eslint-disable-line no-console
		}

		return null;
	};
};

// Should .call() on the instance
const ensureState = function() {
	if (!this._state) {
		this._state = observe({});
	}
	return this._state;
};

class Component extends ObservableComponent {
	constructor(props) {
		super(props);

		const ctor = this.constructor;
		if (ctor.getDerivedStateFromProps && !ctor[gdsfp]) {
			Object.defineProperty(ctor, gdsfp, {
				value: true,
				writable: false,
				enumerable: false,
				configurable: true
			});

			makeDerive(ctor);
		}
	}

	get state() {
		return this._state || ensureState.call(this);
	}

	set state(obj) {
		// If setting to the same thing (or null), ignore
		if (obj === this._state) {
			return;
		}

		// Attempting to set state directly (this.state = ...) after
		// the initial value has already been set. Ignore...
		// This is needed b/c react internally sets the state to copies of the
		// state during render, giving the observation recorder false updates.
		// We can avoid this messyness by moving away from the "state" property.
		if (this._state && !this.shouldUpdate) {
			return;
		}

		// initial state is being set
		if (Object.prototype.toString.call(obj) !== '[object Object]') {
			throw new Error('You must set state to an object');
		}

		if (canReflect.isObservableLike(obj)) {
			this._state = obj;
			return;
		}

		ensureState.call(this);

		Object.assign(this._state, obj);
	}

	//!steal-remove-start
	componentDidMount() {
		super.componentDidMount();

		const element = ReactDOM.findDOMNode(this); // eslint-disable-line react/no-find-dom-node
		if (!element) {
			return;
		}

		canReflect.assignSymbols(element, {
			'can.viewModel': this.state,
		});
	}
	//!steal-remove-end
}

export default Component;
