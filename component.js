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

class Component extends ObservableComponent {
	constructor() {
		super();

		let state = observe({});
		Object.defineProperty(this, 'state', {
			get() {
				return state;
			},
			set(obj) {
				if (Object.prototype.toString.call(obj) !== '[object Object]') {
					throw new Error('You must set state to an object');
				}

				if (canReflect.isObservableLike(obj)) {
					state = obj;
					return;
				}

				Object.assign(state, obj);
			},
			enumerable: true,
			configurable: false
		});

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
