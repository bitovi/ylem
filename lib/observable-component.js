import React from 'react';
import canReflect from 'can-reflect';
import { Object as ObservableClass } from 'can-observe';
import ObserverComponent from './observer-component';
import { createObservablePropsComponent } from './observable-props-component';

class ObservableComponent extends ObserverComponent {
	static ObservableClass = ObservableClass
	static mapProps = p => p

	static getDerivedStateFromProps(nextProps, { observer, observable, mapProps, lastProps }) {
		if (!observable || nextProps === lastProps) {
			return null;
		}

		updateObservableWithProps(observable, mapProps(nextProps), observer);

		return {
			lastProps: nextProps,
		};
	}

	constructor(props) {
		super(props);

		if (this.props.component || this.props.Component) {
			this.Component = createObservablePropsComponent(this.props.component || this.props.Component);
		}

		this.state = {
			observable: new this.constructor.ObservableClass(),
			observer: this.observer,
			mapProps: this.constructor.mapProps,
		};
	}

	componentWillUnmount() {
		super.componentWillUnmount();

		if (this.observable && this.observable.stopListening) {
			this.observable.stopListening();
		}
	}

	get observable() {
		return this.state.observable;
	}

	render() {
		const { Component, observable, props: { render, children } } = this;

		if (render) {
			return render(observable);
		}

		if (Component) {
			return <Component _observable={observable} />;
		}

		if (typeof children === 'function') {
			return children(observable);
		}

		return children;
	}
}

function updateObservableWithProps(observable, newProps, observer) {
	observer.ignore(() => {
		const { render, component, Component, ...props } = newProps; // eslint-disable-line no-unused-vars

		if (Array.isArray(props.children)) {
			// `.children` is non-extensible
			props.children = [ ...props.children ];
		}

		// TODO: generic solution replacing all react components?
		if (props.children) {
			// replace children, do not merge
			// idea would be to merge array, but replace items
			delete observable.children;
		}

		canReflect.assignDeep(observable, props);
	});
}

function createComponent(ObservableClass) {
	return class YlemObservable extends ObservableComponent {
		static ObservableClass = ObservableClass;
	};
}

export default ObservableComponent;
export {
	createComponent
};
