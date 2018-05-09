import React, { Component } from 'react';
import PropTypes from 'prop-types';
import canReflect from 'can-reflect';
import ObservableComponent from './observable-component';

import transformCanObserve from './transforms/can-observe';
import transformCanDefine from './transforms/can-define';

const TRANSFORMS = [
	transformCanObserve,
	transformCanDefine,
];

// TODO: transform? connect(VM, (props) => ({ props }))

export default function connect(config) {
	const type = TRANSFORMS.find(({ test }) => test(config));
	if (!type) {
		console.error('RVM: unrecognized config', config); // eslint-disable-line no-console
		throw new Error('RVM: unrecognized config');
	}

	const { createViewModel, updateViewModel, getPropTypes } = type;

	return function(BaseComponent) {
		const ConnectedComponent = getConnectedComponent(BaseComponent);

		if (BaseComponent.propTypes) {
			ConnectedComponent.propTypes = {
				_vm: PropTypes.shape(BaseComponent.propTypes),
			};
		}

		//!steal-remove-start
		ConnectedComponent.displayName = `${BaseComponent.displayName || BaseComponent.name}~RVMConnected`;

		try {
			Object.defineProperty(ConnectedComponent, 'name', {
				writable: false,
				enumerable: false,
				configurable: true,
				value: ConnectedComponent.displayName,
			});
		}
		catch(e) {
			//
		}

		if (ConnectedComponent.prototype) {
			canReflect.assignSymbols(ConnectedComponent.prototype, {
				'can.getName': function() {
					return canReflect.getName(this.constructor) + '{}';
				},
			});
		}
		//!steal-remove-end

		class UpgradedComponent extends ObservableComponent {
			componentWillReceiveProps(nextProps) {
				this._observer.ignore(() => {
					updateViewModel(this.viewModel, nextProps);
				});
			}

			shouldComponentUpdate() {
				return !!this.viewModel;
			}

			componentWillMount() {
				this._observer.ignore(() => {
					Object.defineProperty(this, 'viewModel', {
						writable: false,
						enumerable: false,
						configurable: true,
						value: createViewModel(config, this.props),
					});
				});

				super.componentWillMount();
			}

			componentWillUnmount() {
				delete this.viewModel;

				super.componentWillUnmount();
			}

			render() {
				const _vm = this.viewModel;

				return React.createElement(ConnectedComponent, { _vm });
			}
		}

		//!steal-remove-start
		UpgradedComponent.displayName = `${ BaseComponent.displayName || BaseComponent.name || 'Component' }~RVM`;

		try {
			Object.defineProperty(UpgradedComponent, 'name', {
				writable: false,
				enumerable: false,
				configurable: true,
				value: UpgradedComponent.displayName,
			});
		}
		catch(e) {
			//
		}

		if (getPropTypes) {
			const propTypes = getPropTypes(config);
			if (propTypes) {
				UpgradedComponent.propTypes = propTypes;
			}
		}

		canReflect.assignSymbols(UpgradedComponent.prototype, {
			'can.getName': function() {
				return canReflect.getName(this.constructor) + '{}';
			},
		});
		//!steal-remove-end

		return UpgradedComponent;
	};
}

function getConnectedComponent(BaseComponent) {
	if (BaseComponent.prototype instanceof Component) {
		class ConnectedComponent extends BaseComponent {
			constructor(props) {
				const proxy = typeof Proxy === 'undefined'
					? Object.assign({}, props._vm, {
						_raw: props,
						_vm: props._vm,
					})
					: new Proxy(props._vm, {
						get(target, prop) {
							if (prop === '_raw') {
								return props;
							}
							if (prop === '_vm') {
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
				if (this._props && props === this._props._vm) {
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

				return this._props._vm;
			}
		}

		if (typeof BaseComponent.prototype.componentWillReceiveProps === 'function') {
			ConnectedComponent.prototype.componentWillReceiveProps = function(props, state) {
				return BaseComponent.prototype.componentWillReceiveProps.call(this, props._vm, state);
			};
		}

		return ConnectedComponent;
	}

	const ConnectedComponent = ({ _vm }) => {
		return BaseComponent(_vm);
	};

	return ConnectedComponent;
}
