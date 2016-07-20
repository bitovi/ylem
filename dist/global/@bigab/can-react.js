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
/*@bigab/can-react@0.0.1#can-react*/
define('@bigab/can-react', [
    'exports',
    'react',
    'can/compute/compute'
], function (exports, _react, _canComputeCompute) {
    'use strict';
    Object.defineProperty(exports, '__esModule', { value: true });
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
    var _get = function get(_x, _x2, _x3) {
        var _again = true;
        _function:
            while (_again) {
                var object = _x, property = _x2, receiver = _x3;
                desc = parent = getter = undefined;
                _again = false;
                if (object === null)
                    object = Function.prototype;
                var desc = Object.getOwnPropertyDescriptor(object, property);
                if (desc === undefined) {
                    var parent = Object.getPrototypeOf(object);
                    if (parent === null) {
                        return undefined;
                    } else {
                        _x = parent;
                        _x2 = property;
                        _x3 = receiver;
                        _again = true;
                        continue _function;
                    }
                } else if ('value' in desc) {
                    return desc.value;
                } else {
                    var getter = desc.get;
                    if (getter === undefined) {
                        return undefined;
                    }
                    return getter.call(receiver);
                }
            }
    };
    exports.connect = connect;
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { 'default': obj };
    }
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError('Cannot call a class as a function');
        }
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
    var _React = _interopRequireDefault(_react);
    var _compute = _interopRequireDefault(_canComputeCompute);
    function connect(mapToProps, ComponentToConnect) {
        var connectDisplayName = 'Connected(' + getDisplayName(ComponentToConnect) + ')';
        var mapToState = function mapToState(props) {
            return Object.assign({}, props, mapToProps(props));
        };
        var ConnectedComponent = function (_React$Component) {
            _inherits(ConnectedComponent, _React$Component);
            function ConnectedComponent(props) {
                var _this = this;
                _classCallCheck(this, ConnectedComponent);
                _get(Object.getPrototypeOf(ConnectedComponent.prototype), 'constructor', this).call(this, props);
                this.propsCompute = (0, _compute['default'])(props);
                this.compute = (0, _compute['default'])(function () {
                    return mapToState(_this.propsCompute());
                });
                this.state = this.compute();
                var batchNum = undefined;
                this.compute.bind('change', function (ev, newVal) {
                    if (!ev.batchNum || ev.batchNum !== batchNum) {
                        _this.setState(newVal);
                    }
                });
            }
            _createClass(ConnectedComponent, [
                {
                    key: 'componentWillReceiveProps',
                    value: function componentWillReceiveProps(nextProps) {
                        this.propsCompute(nextProps);
                    }
                },
                {
                    key: 'render',
                    value: function render() {
                        return _React['default'].createElement(ComponentToConnect, this.state);
                    }
                }
            ]);
            return ConnectedComponent;
        }(_React['default'].Component);
        ConnectedComponent.displayName = connectDisplayName;
        return ConnectedComponent;
    }
    function getDisplayName(ComponentToConnect) {
        return ComponentToConnect.displayName || ComponentToConnect.name || 'Component';
    }
});
/*[global-shim-end]*/
(function(){ // jshint ignore:line
	window._define = window.define;
	window.define = window.define.orig;
}
)();