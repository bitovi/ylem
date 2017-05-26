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
/*react-view-models@0.1.0#observer*/
define('react-view-models/observer', function (require, exports, module) {
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
                throw new Error('Async observations stopped out of order.');
            }
            Observation.observationStack.pop();
            this.updateBindings();
        }
    });
    module.exports = Observer;
});
/*react-view-models@0.1.0#make-enumerable*/
define('react-view-models/make-enumerable', function (require, exports, module) {
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
/*react-view-models@0.1.0#react-view-models*/
define('react-view-models', [
    'exports',
    'react',
    'react-dom',
    'can-compute',
    'can-define/map/map',
    'can-view-scope',
    'react-view-models/observer',
    'react-view-models/make-enumerable'
], function (exports, _react, _reactDom, _canCompute, _map, _canViewScope, _observer, _makeEnumerable) {
    'use strict';
    Object.defineProperty(exports, '__esModule', { value: true });
    exports.Component = undefined;
    exports.reactViewModel = reactViewModel;
    exports.makeReactComponent = makeReactComponent;
    var _react2 = _interopRequireDefault(_react);
    var _reactDom2 = _interopRequireDefault(_reactDom);
    var _canCompute2 = _interopRequireDefault(_canCompute);
    var _map2 = _interopRequireDefault(_map);
    var _canViewScope2 = _interopRequireDefault(_canViewScope);
    var _observer2 = _interopRequireDefault(_observer);
    var _makeEnumerable2 = _interopRequireDefault(_makeEnumerable);
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
            {
                var methods = [
                    'componentWillReceiveProps',
                    'componentWillMount',
                    'componentDidMount',
                    'componentWillUpdate',
                    'componentDidUpdate',
                    'componentWillUnmount'
                ];
                methods.forEach(function (method) {
                    var methodAsString = _this[method].toString();
                    if (_this[method] !== Component.prototype[method] && !methodAsString.includes(method, methodAsString.indexOf(') {'))) {
                        throw new Error('super.' + method + '() must be called on ' + _this.constructor.name + '.');
                    }
                });
            }
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
    function reactViewModel(displayName, ViewModel, App) {
        if (arguments.length === 1) {
            App = arguments[0];
            ViewModel = null;
            displayName = (App.displayName || App.name || 'ReactVMComponent') + 'Wrapper';
        }
        if (arguments.length === 2) {
            App = arguments[1];
            if (typeof arguments[0] === 'string') {
                displayName = arguments[0];
                ViewModel = null;
            } else {
                ViewModel = arguments[0];
                displayName = (App.displayName || App.name || ViewModel.name || 'ReactVMComponent') + 'Wrapper';
            }
        }
        if (!(App.prototype instanceof _react.Component)) {
            var _render = App;
            var Wrapper = function (_Component) {
                _inherits(Wrapper, _Component);
                function Wrapper() {
                    _classCallCheck(this, Wrapper);
                    return _possibleConstructorReturn(this, (Wrapper.__proto__ || Object.getPrototypeOf(Wrapper)).apply(this, arguments));
                }
                _createClass(Wrapper, [{
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
                return Wrapper;
            }(Component);
            Wrapper.ViewModel = ViewModel;
            Wrapper.displayName = displayName;
            App = Wrapper;
        }
        return function (scope, options) {
            if (!(scope instanceof _canViewScope2.default)) {
                scope = _canViewScope2.default.refsScope().add(scope || {});
            }
            if (!(options instanceof _canViewScope2.default.Options)) {
                options = new _canViewScope2.default.Options(options || {});
            }
            var props = (0, _canCompute2.default)(function () {
                var props = {};
                scope._context.each(function (val, name) {
                    props[name] = val;
                });
                return props;
            });
            var el = document.createElement('div');
            _reactDom2.default.render(_react2.default.createElement(App, props()), el);
            props.on('change', function (ev, newValue) {
                _reactDom2.default.render(_react2.default.createElement(App, newValue), el);
            });
            return el;
        };
    }
    function makeReactComponent(displayName, CanComponent) {
        if (arguments.length === 1) {
            CanComponent = arguments[0];
            displayName = (CanComponent.name || 'CanComponent') + 'Wrapper';
        }
        var Wrapper = function (_ReactComponent2) {
            _inherits(Wrapper, _ReactComponent2);
            _createClass(Wrapper, null, [{
                    key: 'name',
                    get: function get() {
                        return displayName;
                    }
                }]);
            function Wrapper() {
                _classCallCheck(this, Wrapper);
                var _this4 = _possibleConstructorReturn(this, (Wrapper.__proto__ || Object.getPrototypeOf(Wrapper)).call(this));
                _this4.canComponent = null;
                _this4.createComponent = _this4.createComponent.bind(_this4);
                return _this4;
            }
            _createClass(Wrapper, [
                {
                    key: 'createComponent',
                    value: function createComponent(el) {
                        var _this5 = this;
                        if (this.canComponent) {
                            this.canComponent = null;
                        }
                        if (el) {
                            this.canComponent = new CanComponent(el, {
                                subtemplate: null,
                                templateType: 'react',
                                parentNodeList: undefined,
                                options: _canViewScope2.default.refsScope().add({}),
                                scope: new _canViewScope2.default.Options({}),
                                setupBindings: function setupBindings(el, makeViewModel, initialViewModelData) {
                                    Object.assign(initialViewModelData, _this5.props);
                                    makeViewModel(initialViewModelData);
                                }
                            });
                        }
                    }
                },
                {
                    key: 'componentWillUpdate',
                    value: function componentWillUpdate(props) {
                        this.canComponent.viewModel.set(props);
                    }
                },
                {
                    key: 'render',
                    value: function render() {
                        return _react2.default.createElement(CanComponent.prototype.tag, { ref: this.createComponent });
                    }
                }
            ]);
            return Wrapper;
        }(_react.Component);
        Wrapper.displayName = displayName;
        return Wrapper;
    }
    exports.default = reactViewModel;
});
/*[global-shim-end]*/
(function(){ // jshint ignore:line
	window._define = window.define;
	window.define = window.define.orig;
}
)();