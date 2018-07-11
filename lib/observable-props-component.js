import { Component } from 'react';
import PropTypes from 'prop-types';
import renameComponent from './rename-component';

function createObservablePropsComponent(BaseComponent) {
	let ExtendedBaseComponent;
	if (BaseComponent.prototype instanceof Component) {
		ExtendedBaseComponent = function(props) {
			const proxy = typeof Proxy === 'undefined'
				? Object.assign({}, props._observable, {
					_raw: props,
					_observable: props._observable,
				})
				: new Proxy(props._observable, {
					get(target, prop) {
						if (prop === '_raw') {
							return props;
						}
						if (prop === '_observable') {
							return target;
						}

						return target[prop];
					},
				})
			;

			const instance = new BaseComponent(proxy);
			instance._props = proxy;
			instance._raw_props = true;

			Object.defineProperty(instance, 'props', {
				set() {
					if (this._props && props === this._props._observable) {
						return;
					}

					this._props = props;
				},
				get() {
					//!steal-remove-start
					if (process.env.NODE_ENV !== 'production') {
						if (this._raw_props) {
							return this._props._raw;
						}
					}
					//!steal-remove-end

					return this._props._observable;
				},
			});

			//!steal-remove-start
			if (process.env.NODE_ENV !== 'production') {
				const componentWillMount = instance.componentWillMount;
				instance.componentWillMount = function() {
					this._raw_props = false;

					if (typeof componentWillMount === 'function') {
						componentWillMount.call(this);
					}
				};
			}
			//!steal-remove-end

			return instance;
		};
	}
	else {
		const renderFn = BaseComponent;
		ExtendedBaseComponent = ({ _observable }) => {
			return renderFn(_observable);
		};
	}

	if (BaseComponent.propTypes) {
		ExtendedBaseComponent.propTypes = {
			_observable: PropTypes.shape(BaseComponent.propTypes),
		};
	}

	//!steal-remove-start
	if (process.env.NODE_ENV !== 'production') {
		renameComponent(ExtendedBaseComponent, `YlemObserved(${BaseComponent.displayName || BaseComponent.name || 'Component'})`);
	}
	//!steal-remove-end

	return ExtendedBaseComponent;

}

export {
	createObservablePropsComponent,
};
