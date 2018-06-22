import { Component } from 'react';
import PropTypes from 'prop-types';
import renameComponent from './rename-component';

function createObservablePropsComponent(BaseComponent) {
	let ExtendedBaseComponent;
	if (BaseComponent.prototype instanceof Component) {
		ExtendedBaseComponent = class extends BaseComponent {
			constructor(props) {
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

				super(proxy);

				//!steal-remove-start
				this._raw_props = true;
				//!steal-remove-end
			}

			//!steal-remove-start
			componentWillMount() {
				this._raw_props = false;

				if (typeof super.componentWillMount === 'function') {
					super.componentWillMount();
				}
			}
			//!steal-remove-end

			set props(props) {
				if (this._props && props === this._props._observable) {
					return;
				}

				this._props = props;
			}

			get props() {
				//!steal-remove-start
				if (this._raw_props) {
					return this._props._raw;
				}
				//!steal-remove-end

				return this._props._observable;
			}
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
	renameComponent(ExtendedBaseComponent, `YlemObserved(${BaseComponent.displayName || BaseComponent.name || 'Component'})`);
	//!steal-remove-end

	return ExtendedBaseComponent;

}

export {
	createObservablePropsComponent,
};
