import React from 'react';
import canReflect from 'can-reflect';
import canDiff from 'can-diff';
import canKey from 'can-key';
import { Object as ObservableClass } from 'can-observe';
import ObserverComponent from './observer-component';
import { createObservablePropsComponent } from './observable-props-component';
import { changes as deriveUpdatesChanges } from '../derivers';

class ObservableComponent extends ObserverComponent {
	static ObservableClass = ObservableClass
	static deriveUpdates = deriveUpdatesChanges;

	static getDerivedStateFromProps(nextProps, { observer, observable, deriveUpdates, lastProps }) {
		if (nextProps !== lastProps) {
			updateObservableWithProps(observable, deriveUpdates(nextProps, lastProps), observer);
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
			deriveUpdates: this.constructor.deriveUpdates,
			lastProps: null,
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
				const prop = canKey.get(observable, key);
				if (Array.isArray(prop)) {
					canReflect.splice(prop, values.index, values.deleteCount, values.insert);
				} 
				else {
					canKey.set(observable, key, props[key]);
				}
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

function createComponent(ObservableClass, { deriveUpdates } = {}) {
	if (deriveUpdates) {
		return class YlemObservable extends ObservableComponent {
			static ObservableClass = ObservableClass
			static deriveUpdates = deriveUpdates
		};
	}

	return class YlemObservable extends ObservableComponent {
		static ObservableClass = ObservableClass
	};
}

export default ObservableComponent;
export {
	createComponent,
};
