import React, { Component } from 'react';
import Observer from './observer';
import canReflect from 'can-reflect';

import transformCanObserve from './transforms/can-observe';
import transformCanDefine from './transforms/can-define';
import transformFunction from './transforms/function';
import transformObject from './transforms/object';

const TRANSFORMS = [
	transformCanObserve,
	transformCanDefine,
	transformFunction,
	transformObject,
];

export default function connect(config) {
	const type = TRANSFORMS.find(({ test }) => test(config));
	if (!type) {
		console.error('RVM: unrecognized config', config); // eslint-disable-line no-console
		throw new Error('RVM: unrecognized config');
	}

	const { createViewModel, updateViewModel, extractProps } = type;

	return function(BaseComponent) {
		class WrappedComponent extends Component {
			static displayName = `${ BaseComponent.displayName || BaseComponent.name || 'Component' }~RVM`

			constructor(props) {
				super(props);

				this._boundMethods = {};

				var observer = function () {
					this.forceUpdate();
				}.bind(this);

				//!steal-remove-start
				Object.defineProperty(observer, "name", {
					value: canReflect.getName(this),
				});
				//!steal-remove-end

				Object.defineProperty(this, "_observer", {
					writable: false,
					enumerable: false,
					configurable: false,
					value: new Observer(observer),
				});
			}

			componentWillReceiveProps(nextProps) {
				this._observer.ignore(function () {
					updateViewModel(this.viewModel, nextProps);
				}.bind(this));
			}

			shouldComponentUpdate() {
				return false;
			}

			componentWillMount() {
				Object.defineProperty(this, "viewModel", {
					writable: false,
					enumerable: false,
					configurable: true,
					value: createViewModel(config, this.props),
				});

				this._observer.startRecording();
			}

			componentDidMount() {
				this._observer.stopRecording();
			}

			componentWillUpdate() {
				this._observer.startRecording();
			}

			componentDidUpdate() {
				this._observer.stopRecording();
			}

			componentWillUnmount() {
				this._observer.teardown();
				delete this.viewModel;
			}

			render() {
				const props = extractProps(config, this.viewModel);
				autobindProps(this._boundMethods, props, this.viewModel);

				return ( <BaseComponent {...props} /> );
			}
		}

		//!steal-remove-start
		try {
			Object.defineProperty(WrappedComponent, "name", {
				writable: false,
				enumerable: false,
				configurable: true,
				value: WrappedComponent.displayName,
			});
		}
		catch(e) {
			//
		}

		canReflect.assignSymbols(WrappedComponent.prototype, {
			"can.getName": function() {
				return canReflect.getName(this.constructor) + "{}";
			},
		});
		//!steal-remove-end

		return WrappedComponent;
	};
}

function autobindProps(methods, props, context) {
	for (const prop in props) {
		if (typeof props[prop] !== 'function') {
			continue;
		}

		if (!methods[prop] || methods[prop].original !== props[prop]) {
			methods[prop] = {
				original: props[prop],
				bound: props[prop].bind(context),
			};
		}

		props[prop] = methods[prop].bound;
	}
}
