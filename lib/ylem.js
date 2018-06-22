import canReflect from 'can-reflect';
import { withObserver } from './observer-component';
import { connect } from './connected-component';

export default function ylem(...args) {
	let ObservableClass = null;
	let Component = null;
	const options = {};

	// Flexible params
	if (args[0].prototype && canReflect.isObservableLike(args[0].prototype)) {
		ObservableClass = args[0];
	}
	if (typeof args[0] === 'function') {
		Component = args[0];
	}
	if (typeof args[1] === 'function') {
		Component = args[1];
	}
	if (args[1] !== Component && typeof args[1] !== 'function') {
		Object.assign(options, args[1]);
	}
	else if (args[2]) {
		Object.assign(options, args[2]);
	}

	// component passed, just wrap with ObserverComponent
	if (!ObservableClass) {
		return withObserver(args[0]);
	}

	if (!Component) {
		return connect(ObservableClass, options);
	}

	return connect(ObservableClass, options)(Component);
}
