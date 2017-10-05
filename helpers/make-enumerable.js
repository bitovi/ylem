var each = require("can-util/js/each/each");

module.exports = function makeEnumerable(Type, recursive) {
	if (recursive === undefined) {
		recursive = true;
	}

	var setup = Type.prototype.setup;
	Type.prototype.setup = function() {
		var map = this;
		each(this._define.definitions, function(value, prop) {
			var parent = Object.getOwnPropertyDescriptor(map.constructor.prototype, prop);
			Object.defineProperty(map, prop, {
				enumerable: true,
				get: parent.get,
				set: parent.set
			});

			if (recursive && value.Type && !isEnumerable(value.Type)) {
				makeEnumerable(value.Type, recursive);
			}
		});

		return setup.apply(this, arguments);
	};

	Type.__isEnumerable = true;
};

function isEnumerable(Type) {
	return !!Type.__isEnumerable;
}

module.exports.isEnumerable = isEnumerable;
