import React from 'react';
import PropTypes from 'prop-types';
import canReflect from 'can-reflect';
import { createNewComponentClass, getConnectedComponent } from './observable-component';

//!steal-remove-start
(function(version) {
	const [ major, minor ] = version.split('.').map(v => +v);
	if (major < 16 || (major === 16 && minor < 3)) {
		throw new Error(`ylem requires at least React v16.3. Currently ${version}`);
	}
})(React.version);
//!steal-remove-end

export default function connect(ViewModel, transform = props => props) {
	return function(BaseComponent) {
		const ConnectedComponent = getConnectedComponent(BaseComponent);

		if (BaseComponent.propTypes) {
			ConnectedComponent.propTypes = {
				_vm: PropTypes.shape(BaseComponent.propTypes),
			};
		}

		//!steal-remove-start
		ConnectedComponent.displayName = `${BaseComponent.displayName || BaseComponent.name}~ylemConnected`;

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

		const UpgradedComponent = createNewComponentClass(ViewModel, transform, _vm => {
			return React.createElement(ConnectedComponent, { _vm });
		});

		//!steal-remove-start
		UpgradedComponent.displayName = `${ BaseComponent.displayName || BaseComponent.name || 'Component' }~ylem`;

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

		if (ViewModel.propTypes) {
			UpgradedComponent.propTypes = ViewModel.propTypes;
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
