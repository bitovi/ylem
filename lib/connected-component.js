import { createComponent } from './observable-component';
import renameComponent from './rename-component';

const connect = (ObservableClass, options) => {
	const ObservableComponent = createComponent(ObservableClass, options);

	return function enhance(BaseComponent) {
		class ConnectedComponent extends ObservableComponent {
			static BaseComponent = BaseComponent
		}

		//!steal-remove-start
		renameComponent(ConnectedComponent, `YlemConnected(${BaseComponent.displayName || BaseComponent.name || 'Component'})`);

		if (ObservableClass.propTypes) {
			ConnectedComponent.propTypes = ObservableClass.propTypes;
		}
		//!steal-remove-end

		return ConnectedComponent;
	};
};

export {
	connect,
};
