import canReflect from 'can-reflect';
import { wrapWithObserverComponent } from './observer-component';
import { connect } from './connected-component';

export default function ylem(...args) {
	let ObservableClass = null;
	let Component = null;
	const options = { mapProps: props => props };
	// Flexible params
	const Subject = args[0];
	if ( Subject.prototype && canReflect.isObservableLike(Subject.prototype) ) {
		ObservableClass = Subject;
	}
	if ( typeof Subject === 'function') {
		Component = Subject;
	}
	if ( typeof args[1] === 'function') {
		Component = args[1];
	}
	if (args[1] !== Component && typeof args[1] !== 'function') {
		Object.assign(options, args[1]);
	} else if (args[2]) {
		Object.assign(options, args[2]);
	}

	// component passed to connect, just wrap with ObserverComponent
	if (!ObservableClass) {
		return wrapWithObserverComponent(Subject);
	}
	if (!Component) {
		return connect(ObservableClass, options);
	}
	return connect(ObservableClass, options)(Component);
}
