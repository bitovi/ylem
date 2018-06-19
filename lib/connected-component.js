import canReflect from 'can-reflect';
import { createComponent } from './observable-component';
import { createObservablePropsComponent } from './observable-props-component';
import { renameComponent } from './rename-component';

const connect = (ObservableClass, options = {}) => {
	const ObservableComponent = createComponent(ObservableClass);
	const { mapProps = p => p } = options;

	return function enhance(BaseComponent) {
		const Component = createObservablePropsComponent(BaseComponent);
		class ConnectedComponent extends ObservableComponent {
			Component = Component
			static mapProps = mapProps
		}

		//!steal-remove-start
		if (process.env.NODE_ENV !== 'production') {
			renameComponent(ConnectedComponent, `YlemConnected(${BaseComponent.displayName || BaseComponent.name || 'Component' })`);

			if (ObservableClass.propTypes) {
				ConnectedComponent.propTypes = ObservableClass.propTypes;
			}

			canReflect.assignSymbols(ConnectedComponent.prototype, {
				'can.getName': function() {
					return canReflect.getName(this.constructor) + '{}';
				},
			});
		}
		//!steal-remove-end

		return ConnectedComponent;
	};
};

export {
	connect
};
