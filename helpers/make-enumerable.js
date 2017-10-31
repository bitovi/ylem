var each = require("can-util/js/each/each");

module.exports = function makeEnumerable(Type, recursive) {
	if (isEnumerable(Type)) {
		return;
	}

	if (recursive === undefined) {
		recursive = true;
	}

	var setup = Type.prototype.setup;
	Type.prototype.setup = function() {
		if (this._define) {
			var map = this;

			each(this._define.definitions, function(value, prop) {
				var descriptor = Object.getOwnPropertyDescriptor(map.constructor.prototype, prop);
				descriptor.enumerable = true;
				Object.defineProperty(map, prop, descriptor);

				if (recursive && value.Type) {
					makeEnumerable(value.Type, recursive);
				}
			});

			each(this._define.methods, function(method, prop) {
				if (prop === 'constructor') {
					return;
				}

				var descriptor = Object.getOwnPropertyDescriptor(map.constructor.prototype, prop);
				descriptor.enumerable = true;
				Object.defineProperty(map, prop, descriptor);
			});
		}

		return setup.apply(this, arguments);
	};

	Object.defineProperty(Type, "__isEnumerable", {
		enumerable: false,
		value: true,
	});
};

function isEnumerable(Type) {
	return !!Type.__isEnumerable;
}

module.exports.isEnumerable = isEnumerable;
