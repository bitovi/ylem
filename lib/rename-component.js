import canReflect from 'can-reflect';

export default function renameComponent(Component, displayName) {
	//!steal-remove-start
	if (process.env.NODE_ENV !== 'production') {
		try {
			Component.displayName = displayName;

			if (Component.prototype) {
				canReflect.assignSymbols(Component.prototype, {
					'can.getName': function() {
						return `${canReflect.getName(this.constructor)}{}`;
					},
				});
			}

			Object.defineProperty(Component, 'name', {
				writable: false,
				enumerable: false,
				configurable: true,
				value: Component.displayName,
			});
		}
		catch (e) {
			//
		}
	}
	//!steal-remove-end
}
