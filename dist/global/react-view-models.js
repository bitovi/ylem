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
/*react-view-models@0.0.8#react-view-models*/
define('react-view-models', [
    'exports',
    'react',
    'can-compute',
    'can-types',
    'can-util'
], function (exports, _react, _canCompute, _canTypes, _canUtil) {
    'use strict';
    Object.defineProperty(exports, '__esModule', { value: true });
    exports.asArray = exports.nobind = undefined;
    exports.connect = connect;
    exports.extractProps = extractProps;
    var _react2 = _interopRequireDefault(_react);
    var _canCompute2 = _interopRequireDefault(_canCompute);
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
    var nobind = exports.nobind = 'nobind';
    var asArray = exports.asArray = 'asArray';
    function connect(ViewModel, ComponentToConnect) {
        var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {}, _ref$properties = _ref.properties, properties = _ref$properties === undefined ? {} : _ref$properties, displayName = _ref.displayName, _ref$deepObserve = _ref.deepObserve, deepObserve = _ref$deepObserve === undefined ? false : _ref$deepObserve;
        if (typeof ViewModel !== 'function') {
            throw new Error('Setting the viewmodel to an instance or value is not supported');
        }
        var ConnectedComponent = function (_React$Component) {
            _inherits(ConnectedComponent, _React$Component);
            function ConnectedComponent(props) {
                _classCallCheck(this, ConnectedComponent);
                var _this = _possibleConstructorReturn(this, (ConnectedComponent.__proto__ || Object.getPrototypeOf(ConnectedComponent)).call(this, props));
                if ((0, _canTypes.isConstructor)(ViewModel)) {
                    _this.viewModel = new ViewModel(props);
                    _this._render = (0, _canCompute2.default)(_this.observedRender, _this);
                    _this.state = { viewModel: _this.viewModel };
                } else {
                    _this.mapToProps = ViewModel;
                    _this.propsCompute = (0, _canCompute2.default)(props);
                    _this._render = (0, _canCompute2.default)(function () {
                        var props = this.mapToProps(this.propsCompute());
                        return _react2.default.createElement(ComponentToConnect, props, this.props.children);
                    }, _this);
                }
                var batchNum = void 0;
                _this._render.bind('change', function (ev, newVal) {
                    if (!ev.batchNum || ev.batchNum !== batchNum) {
                        batchNum = ev.batchNum;
                        _this.setState({ propsForChild: newVal });
                    }
                });
                return _this;
            }
            _createClass(ConnectedComponent, [
                {
                    key: 'observedRender',
                    value: function observedRender() {
                        var vm = this.viewModel;
                        if (deepObserve) {
                            vm.get();
                        }
                        var props = extractProps(vm, properties, this.props);
                        return _react2.default.createElement(ComponentToConnect, props, this.props.children);
                    }
                },
                {
                    key: 'componentWillUnmount',
                    value: function componentWillUnmount() {
                        this._render.off('change');
                        this.viewModel = null;
                    }
                },
                {
                    key: 'componentWillReceiveProps',
                    value: function componentWillReceiveProps(nextProps) {
                        if (this.viewModel) {
                            this.viewModel.set(nextProps);
                        } else {
                            this.propsCompute(nextProps);
                        }
                    }
                },
                {
                    key: 'render',
                    value: function render() {
                        return this._render();
                    }
                }
            ]);
            return ConnectedComponent;
        }(_react2.default.Component);
        ConnectedComponent.displayName = displayName || getDisplayName(ComponentToConnect);
        return ConnectedComponent;
    }
    exports.default = connect;
    function extractProps(vm, properties, ownProps) {
        var props = {};
        if (properties['...']) {
            Object.keys(ownProps).forEach(function (key) {
                if (properties[key] !== false) {
                    props[key] = ownProps[key];
                }
            });
        }
        Object.keys(properties).forEach(function (key) {
            if (key === '...')
                return;
            var propertyVal = properties[key];
            if (propertyVal) {
                var bindFunction = typeof vm[key] === 'function' && propertyVal !== nobind;
                props[key] = bindFunction ? vm[key].bind(vm) : vm[key];
                if (propertyVal === asArray) {
                    props[key] = (0, _canUtil.makeArray)(props[key]);
                }
            }
        });
        return props;
    }
    function getDisplayName(ComponentToConnect) {
        var componentName = ComponentToConnect.displayName || ComponentToConnect.name || 'Component';
        return 'Connected(' + componentName + ')';
    }
});
/*[global-shim-end]*/
(function(){ // jshint ignore:line
	window._define = window.define;
	window.define = window.define.orig;
}
)();