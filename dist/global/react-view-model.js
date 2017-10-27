/*[global-shim-start]*/
(function(exports, global, doEval) {
	// jshint ignore:line
	var origDefine = global.define;

	var get = function(name) {
		var parts = name.split("."),
			cur = global,
			i;
		for (i = 0; i < parts.length; i++) {
			if (!cur) {
				break;
			}
			cur = cur[parts[i]];
		}
		return cur;
	};
	var set = function(name, val) {
		var parts = name.split("."),
			cur = global,
			i,
			part,
			next;
		for (i = 0; i < parts.length - 1; i++) {
			part = parts[i];
			next = cur[part];
			if (!next) {
				next = cur[part] = {};
			}
			cur = next;
		}
		part = parts[parts.length - 1];
		cur[part] = val;
	};
	var useDefault = function(mod) {
		if (!mod || !mod.__esModule) return false;
		var esProps = { __esModule: true, default: true };
		for (var p in mod) {
			if (!esProps[p]) return false;
		}
		return true;
	};

	var hasCjsDependencies = function(deps) {
		return (
			deps[0] === "require" && deps[1] === "exports" && deps[2] === "module"
		);
	};

	var modules =
		(global.define && global.define.modules) ||
		(global._define && global._define.modules) ||
		{};
	var ourDefine = (global.define = function(moduleName, deps, callback) {
		var module;
		if (typeof deps === "function") {
			callback = deps;
			deps = [];
		}
		var args = [],
			i;
		for (i = 0; i < deps.length; i++) {
			args.push(
				exports[deps[i]]
					? get(exports[deps[i]])
					: modules[deps[i]] || get(deps[i])
			);
		}
		// CJS has no dependencies but 3 callback arguments
		if (hasCjsDependencies(deps) || (!deps.length && callback.length)) {
			module = { exports: {} };
			args[0] = function(name) {
				return exports[name] ? get(exports[name]) : modules[name];
			};
			args[1] = module.exports;
			args[2] = module;
		} else if (!args[0] && deps[0] === "exports") {
			// Babel uses the exports and module object.
			module = { exports: {} };
			args[0] = module.exports;
			if (deps[1] === "module") {
				args[1] = module;
			}
		} else if (!args[0] && deps[0] === "module") {
			args[0] = { id: moduleName };
		}

		global.define = origDefine;
		var result = callback ? callback.apply(null, args) : undefined;
		global.define = ourDefine;

		// Favor CJS module.exports over the return value
		result = module && module.exports ? module.exports : result;
		modules[moduleName] = result;

		// Set global exports
		var globalExport = exports[moduleName];
		if (globalExport && !get(globalExport)) {
			if (useDefault(result)) {
				result = result["default"];
			}
			set(globalExport, result);
		}
	});
	global.define.orig = origDefine;
	global.define.modules = modules;
	global.define.amd = true;
	ourDefine("@loader", [], function() {
		// shim for @@global-helpers
		var noop = function() {};
		return {
			get: function() {
				return { prepareGlobal: noop, retrieveGlobal: noop };
			},
			global: global,
			__exec: function(__load) {
				doEval(__load.source, global);
			}
		};
	});
})(
	{},
	typeof self == "object" && self.Object == Object ? self : window,
	function(__$source__, __$global__) {
		// jshint ignore:line
		eval("(function() { " + __$source__ + " \n }).call(__$global__);");
	}
);

/*react-view-model@1.0.0-pre.0#observer*/
define('react-view-model/observer', [
    'require',
    'exports',
    'module',
    'can-reflect',
    'can-observation-recorder',
    'can-observation/recorder-dependency-helpers',
    'can-queues'
], function (require, exports, module) {
    var canReflect = require('can-reflect');
    var ObservationRecorder = require('can-observation-recorder');
    var recorderHelpers = require('can-observation/recorder-dependency-helpers');
    var queues = require('can-queues');
    var ORDER = undefined;
    function Observer(onUpdate) {
        this.newDependencies = ObservationRecorder.makeDependenciesRecorder();
        this.oldDependencies = null;
        this.onUpdate = onUpdate;
        var self = this;
        this.onDependencyChange = function (newVal, oldVal) {
            self.dependencyChange(this, newVal, oldVal);
        };
    }
    Observer.prototype.startRecording = function () {
        this.oldDependencies = this.newDependencies;
        ObservationRecorder.start();
        if (this.order !== undefined) {
            ORDER = this.order;
        } else {
            if (ORDER !== undefined) {
                this.order = ++ORDER;
            } else {
                this.order = ORDER = 0;
            }
        }
    };
    Observer.prototype.stopRecording = function () {
        this.newDependencies = ObservationRecorder.stop();
        recorderHelpers.updateObservations(this);
    };
    Observer.prototype.dependencyChange = function () {
        queues.deriveQueue.enqueue(this.onUpdate, this, [], { priority: this.order });
    };
    Observer.prototype.teardown = function () {
        queues.priorityQueue.dequeue(this.onUpdate);
    };
    module.exports = Observer;
});
/*react-view-model@1.0.0-pre.0#helpers/make-enumerable*/
define('react-view-model/helpers/make-enumerable', [
    'require',
    'exports',
    'module',
    'can-util/js/each/each'
], function (require, exports, module) {
    var each = require('can-util/js/each/each');
    module.exports = function makeEnumerable(Type, recursive) {
        if (recursive === undefined) {
            recursive = true;
        }
        var setup = Type.prototype.setup;
        Type.prototype.setup = function () {
            var map = this;
            each(this._define.definitions, function (value, prop) {
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
});
/*react-view-model@1.0.0-pre.0#helpers/autobind-methods*/
define('react-view-model/helpers/autobind-methods', [
    'require',
    'exports',
    'module',
    'can-util/js/each/each',
    'can-define/map/map'
], function (require, exports, module) {
    var each = require('can-util/js/each/each');
    var DefineMap = require('can-define/map/map');
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
});
/*react-view-model@1.0.0-pre.0#component*/
define('react-view-model/component', [
    'require',
    'exports',
    'module',
    'react',
    'can-reflect',
    'can-define/map/map',
    'can-util/js/assign/assign',
    'react-view-model/observer',
    'react-view-model/helpers/make-enumerable',
    'react-view-model/helpers/autobind-methods',
    'can-util/js/dev/dev',
    'can-namespace'
], function (require, exports, module) {
    var React = require('react');
    var canReflect = require('can-reflect');
    var DefineMap = require('can-define/map/map');
    var assign = require('can-util/js/assign/assign');
    var Observer = require('react-view-model/observer');
    var makeEnumerable = require('react-view-model/helpers/make-enumerable');
    var autobindMethods = require('react-view-model/helpers/autobind-methods');
    var dev = require('can-util/js/dev/dev');
    var namespace = require('can-namespace');
    if (React) {
        var Component = function Component() {
            React.Component.call(this);
            if (this.constructor.ViewModel) {
                autobindMethods(this.constructor.ViewModel, true);
                if (!makeEnumerable.isEnumerable(this.constructor.ViewModel)) {
                    makeEnumerable(this.constructor.ViewModel, true);
                }
            }
            var observer = function () {
                if (typeof this._shouldComponentUpdate !== 'function' || this._shouldComponentUpdate()) {
                    this.forceUpdate();
                }
            }.bind(this);
            this._observer = new Observer(observer);
            if (typeof this.shouldComponentUpdate === 'function') {
                this._shouldComponentUpdate = this.shouldComponentUpdate;
            }
            this.shouldComponentUpdate = function () {
                return false;
            };
        };
        Component.prototype = Object.create(React.Component.prototype);
        Component.prototype.constructor = Component;
        assign(Component.prototype, {
            constructor: Component,
            componentWillReceiveProps: function (nextProps) {
                var props = {};
                for (var key in nextProps) {
                    if (!(key in this.props) || nextProps[key] !== this.props[key]) {
                        props[key] = nextProps[key];
                    }
                }
                this.viewModel.assign(props);
            },
            componentWillMount: function () {
                var ViewModel = this.constructor.ViewModel || DefineMap;
                this.viewModel = new ViewModel(this.props);
                this._observer.startRecording();
            },
            componentDidMount: function () {
                this._observer.stopRecording();
            },
            componentWillUpdate: function () {
                this._observer.startRecording();
            },
            componentDidUpdate: function () {
                this._observer.stopRecording();
            },
            componentWillUnmount: function () {
                this._observer.teardown();
                this.viewModel = null;
            }
        });
        module.exports = namespace.ReactViewModelComponent = Component;
    } else {
        module.exports = namespace.ReactViewModelComponent = function Component() {
            throw new Error('You must provide React before can.all.js');
        };
    }
});
/*react-view-model@1.0.0-pre.0#helpers/observable-promise*/
define('react-view-model/helpers/observable-promise', [
    'exports',
    'can-define/map/map',
    'can-stache-key'
], function (exports, _map, _canStacheKey) {
    'use strict';
    Object.defineProperty(exports, '__esModule', { value: true });
    var _map2 = _interopRequireDefault(_map);
    var _canStacheKey2 = _interopRequireDefault(_canStacheKey);
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
    }
    exports.default = _map2.default.extend('ObservablePromise', {
        init: function init(promise) {
            this.promise = promise;
        },
        promise: 'any',
        isPending: {
            get: function get() {
                return _canStacheKey2.default.read(this, _canStacheKey2.default.reads('promise.isPending')).value;
            }
        },
        isResolved: {
            get: function get() {
                return _canStacheKey2.default.read(this, _canStacheKey2.default.reads('promise.isResolved')).value;
            }
        },
        isRejected: {
            get: function get() {
                return _canStacheKey2.default.read(this, _canStacheKey2.default.reads('promise.isRejected')).value;
            }
        },
        reason: {
            get: function get() {
                return _canStacheKey2.default.read(this, _canStacheKey2.default.reads('promise.reason')).value;
            }
        },
        value: {
            get: function get() {
                return _canStacheKey2.default.read(this, _canStacheKey2.default.reads('promise.value')).value;
            }
        }
    });
});
/*react-view-model@1.0.0-pre.0#react-view-model*/
define('react-view-model', [
    'require',
    'exports',
    'module',
    'can-util/js/assign/assign',
    'react-view-model/component',
    'can-namespace',
    'react-view-model/helpers/observable-promise',
    'react-view-model/helpers/autobind-methods',
    'react-view-model/helpers/make-enumerable'
], function (require, exports, module) {
    var assign = require('can-util/js/assign/assign');
    var Component = require('react-view-model/component');
    var namespace = require('can-namespace');
    var ObservablePromise = require('react-view-model/helpers/observable-promise');
    var autobindMethods = require('react-view-model/helpers/autobind-methods');
    var makeEnumerable = require('react-view-model/helpers/make-enumerable');
    module.exports = namespace.reactViewModel = function reactViewModel(displayName, ViewModel, render) {
        if (arguments.length === 1) {
            render = arguments[0];
            ViewModel = null;
            displayName = null;
        }
        if (arguments.length === 2) {
            render = arguments[1];
            if (typeof arguments[0] === 'string') {
                displayName = arguments[0];
                ViewModel = null;
            } else {
                ViewModel = arguments[0];
                displayName = null;
            }
        }
        if (!displayName) {
            displayName = (render.displayName || render.name || 'ReactVMComponent') + 'Wrapper';
        }
        function App() {
            Component.call(this);
        }
        App.ViewModel = ViewModel;
        App.displayName = displayName;
        App.prototype = Object.create(Component.prototype);
        assign(App.prototype, {
            constructor: App,
            render: function () {
                return render(this.viewModel);
            }
        });
        try {
            Object.defineProperty(App, 'name', {
                writable: false,
                enumerable: false,
                configurable: true,
                value: displayName
            });
        } catch (e) {
        }
        return App;
    };
    module.exports.Component = Component;
    module.exports.ObservablePromise = ObservablePromise;
    module.exports.autobindMethods = autobindMethods;
    module.exports.makeEnumerable = makeEnumerable;
});
/*[global-shim-end]*/
(function(global) { // jshint ignore:line
	global._define = global.define;
	global.define = global.define.orig;
}
)(typeof self == "object" && self.Object == Object ? self : window);