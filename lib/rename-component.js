export function renameComponent(Component, displayName) {
	Component.displayName = displayName;
	try {
		Object.defineProperty(Component, 'name', {
			writable: false,
			enumerable: false,
			configurable: true,
			value: Component.displayName,
		});
	}
	catch(e) {
		//
	}
}
