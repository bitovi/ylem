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
/*react-view-model@0.2.0#observer*/
define('react-view-model/observer', function (require, exports, module) {
    var Observation = require('can-observation');
    var assign = require('can-util/js/assign/assign');
    function Observer() {
        Observation.call(this, null, null, () => this.listener && this.listener());
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
/*react-view-model@0.2.0#make-enumerable*/
define('react-view-model/make-enumerable', function (require, exports, module) {
    var each = require('can-util/js/each/each');
    module.exports = function makeEnumerable(Type, recursive) {
        if (recursive === undefined) {
            recursive = true;
        }
        let setup = Type.prototype.setup;
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
/*react-view-model@0.2.0#react-view-model*/
define('react-view-model', [
    'exports',
    'react',
    'can-define/map/map',
    'react-view-model/observer',
    'react-view-model/make-enumerable',
    'can-util/js/dev/dev'
], function (exports, _react, _map, _observer, _makeEnumerable, _dev) {
    'use strict';
    Object.defineProperty(exports, '__esModule', { value: true });
    exports.default = exports.Component = undefined;
    var _map2 = _interopRequireDefault(_map);
    var _observer2 = _interopRequireDefault(_observer);
    var _makeEnumerable2 = _interopRequireDefault(_makeEnumerable);
    var _dev2 = _interopRequireDefault(_dev);
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
    }
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError('Cannot call a class as a function');
        }
    }
    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ('value' in descriptor)
                    descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        return function (Constructor, protoProps, staticProps) {
            if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
            if (staticProps)
                defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();
    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');
        }
        return call && (typeof call === 'object' || typeof call === 'function') ? call : self;
    }
    function _inherits(subClass, superClass) {
        if (typeof superClass !== 'function' && superClass !== null) {
            throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass)
            Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }
    var Component = exports.Component = function (_ReactComponent) {
        _inherits(Component, _ReactComponent);
        function Component() {
            _classCallCheck(this, Component);
            var _this = _possibleConstructorReturn(this, (Component.__proto__ || Object.getPrototypeOf(Component)).call(this));
            if (_this.constructor.ViewModel && !(0, _makeEnumerable.isEnumerable)(_this.constructor.ViewModel)) {
                (0, _makeEnumerable2.default)(_this.constructor.ViewModel, true);
            }
            _this._observer = new _observer2.default();
            if (typeof _this.shouldComponentUpdate === 'function') {
                _this._shouldComponentUpdate = _this.shouldComponentUpdate;
            }
            _this.shouldComponentUpdate = function () {
                return false;
            };
            return _this;
        }
        _createClass(Component, [
            {
                key: 'componentWillReceiveProps',
                value: function componentWillReceiveProps(nextProps) {
                    this.viewModel.set(nextProps);
                }
            },
            {
                key: 'componentWillMount',
                value: function componentWillMount() {
                    var _this2 = this;
                    var ViewModel = this.constructor.ViewModel || _map2.default;
                    this.viewModel = new ViewModel(this._props);
                    this._observer.startLisening(function () {
                        if (typeof _this2._shouldComponentUpdate !== 'function' || _this2._shouldComponentUpdate()) {
                            _this2.forceUpdate();
                        }
                    });
                }
            },
            {
                key: 'componentDidMount',
                value: function componentDidMount() {
                    this._observer.stopListening();
                }
            },
            {
                key: 'componentWillUpdate',
                value: function componentWillUpdate() {
                    this._observer.startLisening();
                }
            },
            {
                key: 'componentDidUpdate',
                value: function componentDidUpdate() {
                    this._observer.stopListening();
                }
            },
            {
                key: 'componentWillUnmount',
                value: function componentWillUnmount() {
                    this._observer.stop();
                    this.viewModel = null;
                }
            },
            {
                key: 'props',
                get: function get() {
                    return this.viewModel;
                },
                set: function set(value) {
                    this._props = value;
                }
            }
        ]);
        return Component;
    }(_react.Component);
    function reactViewModel(displayName, ViewModel, _render) {
        if (arguments.length === 1) {
            _render = arguments[0];
            ViewModel = null;
            displayName = null;
        }
        if (arguments.length === 2) {
            _render = arguments[1];
            if (typeof arguments[0] === 'string') {
                displayName = arguments[0];
                ViewModel = null;
            } else {
                ViewModel = arguments[0];
                displayName = null;
            }
        }
        if (!displayName) {
            displayName = (_render.displayName || _render.name || 'ReactVMComponent') + 'Wrapper';
        }
        var App = function (_Component) {
            _inherits(App, _Component);
            function App() {
                _classCallCheck(this, App);
                return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
            }
            _createClass(App, [{
                    key: 'render',
                    value: function render() {
                        return _render(this.props);
                    }
                }], [{
                    key: 'name',
                    get: function get() {
                        return displayName;
                    }
                }]);
            return App;
        }(Component);
        App.ViewModel = ViewModel;
        App.displayName = displayName;
        return App;
    }
    exports.default = reactViewModel;
});
/*[global-shim-end]*/
(function(){ // jshint ignore:line
	window._define = window.define;
	window.define = window.define.orig;
}
)();