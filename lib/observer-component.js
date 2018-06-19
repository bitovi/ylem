import React, { Component } from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import canReflect from 'can-reflect';
import { Object as ObserveObject } from 'can-observe';
import Observer from './can-observer';
import { renameComponent } from './rename-component';

const EMPTY_OBJ = {};
const store = Symbol('store');

class ObserverComponent extends Component {
	constructor(props) {
		super(props);

		this.observer = new Observer(() => {
			this.shouldUpdate = true;
			this.setState(EMPTY_OBJ);
		});
		this.shouldUpdate = true;

		//!steal-remove-start
		Object.defineProperty(this.observer.onUpdate, 'name', {
			value: canReflect.getName(this),
		});
		//!steal-remove-end

		const oldRender = this.render;
		this.render = function() {
			this.observer.startRecording();
			return oldRender.call(this, this.props);
		};
	}

	componentDidMount() {
		this.observer.stopRecording();
	}

	componentDidUpdate() {
		this.observer.stopRecording();
	}

	componentWillUnmount() {
		this.observer.teardown();
		delete this.observer;
	}

	shouldComponentUpdate(props, state) {
		if (!this.observer
			|| (super.shouldComponentUpdate && !super.shouldComponentUpdate(props, state))
			|| !this.shouldUpdate) {
			return false;
		}

		this.shouldUpdate = false;

		return true;
	}
}

class ObserverComponentWithStore extends ObserverComponent {
	get store() {
		return this[store];
	}
	set store(val) {
		if ( val && typeof val === 'object' && !canReflect.isObservableLike(val) ) {
			val = new ObserveObject(val);
		}
		this[store] = val;
	}
}

function wrapWithObserverComponent(BaseComponent) {
	// TODO: hoisting and other basic HoC stuff (like forwardRef thing)
	class YlemObserver extends ObserverComponent {
		render() {
			const {forwardedRef, ...restOfProps} = this.props;
			return <BaseComponent ref={forwardedRef} {...restOfProps} />;
		}
	}
	hoistNonReactStatic(YlemObserver, BaseComponent);

	//!steal-remove-start
	renameComponent(YlemObserver, `YlemObserver(${BaseComponent.displayName || BaseComponent.name})`);
	//!steal-remove-end

	// return React.forwardRef((props, ref) => {
	// 	return <YlemObserver {...props} forwardedRef={ref} />;
	// });
	return YlemObserver;
}

export default ObserverComponent;
export {
	ObserverComponentWithStore as Component,
	wrapWithObserverComponent,
	wrapWithObserverComponent as observer
};
