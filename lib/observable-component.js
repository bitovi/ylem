import React from 'react';
import canReflect from 'can-reflect';
import canDiff from 'can-diff';
import canKey from 'can-key';
import { Object as ObservableClass } from 'can-observe';
import ObserverComponent from './observer-component';
import { createObservablePropsComponent } from './observable-props-component';

class ObservableComponent extends ObserverComponent {
	static ObservableClass = ObservableClass
	static mapProps = (nextProps) => nextProps;

	static getDerivedStateFromProps(nextProps, { observer, observable, mapProps, lastProps }) {
		if (nextProps !== lastProps) {
			updateObservableWithProps(observable, mapProps(nextProps, lastProps), observer);
		}

		return {
			lastProps: nextProps,
		};
	}

	constructor(props) {
		super(props);

		if (!this.Component) {
			const BaseComponent = this.constructor.BaseComponent || this.props.Component || this.props.component;

			if (BaseComponent) {
				this.Component = createObservablePropsComponent(BaseComponent);
			}
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

		if (Component) {
			return <Component _observable={observable} />;
		}

		if (render) {
			return render(observable);
		}

		if (typeof children === 'function') {
			return children(observable);
		}

		return children;
	}
}

function updateObservableWithProps(observable, newProps, observer) {
	if (!newProps) {
		return;
	}

	observer.ignore(() => {
		const { render, component, Component, ...props } = newProps; // eslint-disable-line no-unused-vars

		// React needs the children object to different or it will not re-render
		// We need to remove the old one so that the new one will replace it, rather than merge
		if (props.children) {
			delete observable.children;
		}

		const patches = canDiff.deep(observable, props);
		for (const { key, type, ...values } of patches) {
			if (type === 'delete') {
				continue;
			}

			if (type === 'splice') {
				canReflect.splice(canKey.get(observable, key), values.index, values.deleteCount, values.insert);
			}

			if (type === 'add' || type === 'set') {
				if (typeof values.value === 'object' && !React.isValidElement(values.value) && !Object.isExtensible(values.value)) {
					if (canReflect.isMoreListLikeThanMapLike(values.value)) {
						values.value = [ ...values.value ];
					}
					else {
						values.value = { ...values.value };
					}
				}

				canKey.set(observable, key, values.value);
			}
		}
	});
}

function createComponent(ObservableClass, { mapProps = props => props } = {}) {
	return class YlemObservable extends ObservableComponent {
		static ObservableClass = ObservableClass
		static mapProps = mapProps
	};
}

export default ObservableComponent;
export {
	createComponent,
};
