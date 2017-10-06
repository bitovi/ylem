var each = require("can-util/js/each/each");
var DefineMap = require("can-define/map/map");

var METHODS_TO_AUTOBIND_KEY = '_methodsToAutobind-react-view-models';

module.exports = function autobindMethods(ViewModel) {
	if (ViewModel[METHODS_TO_AUTOBIND_KEY]) {
		return;
	}
	var setup = ViewModel.prototype.setup;
	var methods = getMethods(ViewModel.prototype, {});
	Object.defineProperty(ViewModel, METHODS_TO_AUTOBIND_KEY, {
		enumerable: false,
		value: methods
	});
	ViewModel.prototype.setup = function setUpWithAutobind() {
		for (var key in methods) {
			this[key] = methods[key].bind(this);
		}
		// call original setup
		return setup.apply(this, arguments);
	};
};

function getMethods(proto, methods) {
	if (proto && proto !== Object.prototype && proto !== DefineMap.prototype) {
		each(proto._define.methods, function (property, key) {
			if (!(key in methods) && key !== 'constructor') {
				methods[key] = property;
			}
		});
		return getMethods(Object.getPrototypeOf(proto), methods);
	}
	return methods;
}
