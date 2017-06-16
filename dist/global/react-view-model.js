/*[global-shim-start]*/
(function(exports, global, doEval){ // jshint ignore:line
	var origDefine = global.define;

	var get = function(name){
		var parts = name.split("."),
			cur = global,
			i;
		for(i = 0 ; i < parts.length; i++){
			if(!cur) {
				break;
			}
			cur = cur[parts[i]];
		}
		return cur;
	};
	var set = function(name, val){
		var parts = name.split("."),
			cur = global,
			i, part, next;
		for(i = 0; i < parts.length - 1; i++) {
			part = parts[i];
			next = cur[part];
			if(!next) {
				next = cur[part] = {};
			}
			cur = next;
		}
		part = parts[parts.length - 1];
		cur[part] = val;
	};
	var useDefault = function(mod){
		if(!mod || !mod.__esModule) return false;
		var esProps = { __esModule: true, "default": true };
		for(var p in mod) {
			if(!esProps[p]) return false;
		}
		return true;
	};
	var modules = (global.define && global.define.modules) ||
		(global._define && global._define.modules) || {};
	var ourDefine = global.define = function(moduleName, deps, callback){
		var module;
		if(typeof deps === "function") {
			callback = deps;
			deps = [];
		}
		var args = [],
			i;
		for(i =0; i < deps.length; i++) {
			args.push( exports[deps[i]] ? get(exports[deps[i]]) : ( modules[deps[i]] || get(deps[i]) )  );
		}
		// CJS has no dependencies but 3 callback arguments
		if(!deps.length && callback.length) {
			module = { exports: {} };
			var require = function(name) {
				return exports[name] ? get(exports[name]) : modules[name];
			};
			args.push(require, module.exports, module);
		}
		// Babel uses the exports and module object.
		else if(!args[0] && deps[0] === "exports") {
			module = { exports: {} };
			args[0] = module.exports;
			if(deps[1] === "module") {
				args[1] = module;
			}
		} else if(!args[0] && deps[0] === "module") {
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
		if(globalExport && !get(globalExport)) {
			if(useDefault(result)) {
				result = result["default"];
			}
			set(globalExport, result);
		}
	};
	global.define.orig = origDefine;
	global.define.modules = modules;
	global.define.amd = true;
	ourDefine("@loader", [], function(){
		// shim for @@global-helpers
		var noop = function(){};
		return {
			get: function(){
				return { prepareGlobal: noop, retrieveGlobal: noop };
			},
			global: global,
			__exec: function(__load){
				doEval(__load.source, global);
			}
		};
	});
}
)({},window,function(__$source__, __$global__) { // jshint ignore:line
	eval("(function() { " + __$source__ + " \n }).call(__$global__);");
}
)
/*react-view-model@0.5.2#observer*/
define('react-view-model/observer', function (require, exports, module) {
    var Observation = require('can-observation');
    var assign = require('can-util/js/assign/assign');
    function Observer() {
        var self = this;
        Observation.call(self, null, null, function () {
            return self.listener && self.listener();
        });
    }
    Observer.prototype = Object.create(Observation.prototype);
    Observer.prototype.constructor = Observer;
    assign(Observer.prototype, {
        start: function () {
            this.value = Date.now();
        },
        startLisening: function (listener) {
            this.listener = listener || this.listener;
            this.bound = true;
            this.oldObserved = this.newObserved || {};
            this.ignore = 0;
            this.newObserved = {};
            Observation.observationStack.push(this);
        },
        stopListening: function () {
            if (Observation.observationStack[Observation.observationStack.length - 1] !== this) {
                var index = Observation.observationStack.indexOf(this);
                if (index === -1) {
                    throw new Error('Async observations stopped out of order.');
                }
                Observation.observationStack.splice(index, 1);
                Observation.observationStack.push(this);
            }
            Observation.observationStack.pop();
            this.updateBindings();
        }
    });
    module.exports = Observer;
});
/*react-view-model@0.5.2#make-enumerable*/
define('react-view-model/make-enumerable', function (require, exports, module) {
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
/*react-view-model@0.5.2#component*/
define('react-view-model/component', function (require, exports, module) {
    var ReactComponent = require('react').Component;
    var DefineMap = require('can-define/map/map');
    var assign = require('can-util/js/assign/assign');
    var Observer = require('react-view-model/observer');
    var makeEnumerable = require('react-view-model/make-enumerable');
    var dev = require('can-util/js/dev/dev');
    var namespace = require('can-namespace');
    function Component() {
        ReactComponent.call(this);
        if (this.constructor.ViewModel && !makeEnumerable.isEnumerable(this.constructor.ViewModel)) {
            makeEnumerable(this.constructor.ViewModel, true);
        }
        this._observer = new Observer();
        if (typeof this.shouldComponentUpdate === 'function') {
            this._shouldComponentUpdate = this.shouldComponentUpdate;
        }
        this.shouldComponentUpdate = function () {
            return false;
        };
    }
    Component.prototype = Object.create(ReactComponent.prototype);
    assign(Component.prototype, {
        constructor: Component,
        componentWillReceiveProps: function (nextProps) {
            var props = {};
            for (var key in nextProps) {
                if (!(key in this.props) || nextProps[key] !== this.props[key]) {
                    props[key] = nextProps[key];
                }
            }
            this.viewModel.set(props);
        },
        componentWillMount: function () {
            var ViewModel = this.constructor.ViewModel || DefineMap;
            this.viewModel = new ViewModel(this.props);
            this._observer.startLisening(function () {
                if (typeof this._shouldComponentUpdate !== 'function' || this._shouldComponentUpdate()) {
                    this.forceUpdate();
                }
            }.bind(this));
        },
        componentDidMount: function () {
            this._observer.stopListening();
        },
        componentWillUpdate: function () {
            this._observer.startLisening();
        },
        componentDidUpdate: function () {
            this._observer.stopListening();
        },
        componentWillUnmount: function () {
            this._observer.stop();
            this.viewModel = null;
        }
    });
    module.exports = namespace.ReactViewModelComponent = Component;
});
/*react-view-model@0.5.2#react-view-model*/
define('react-view-model', function (require, exports, module) {
    var assign = require('can-util/js/assign/assign');
    var Component = require('react-view-model/component');
    var namespace = require('can-namespace');
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
});
/*[global-shim-end]*/
(function(){ // jshint ignore:line
	window._define = window.define;
	window.define = window.define.orig;
}
)();