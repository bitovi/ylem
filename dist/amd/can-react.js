/*@bigab/can-react@0.0.2#can-react*/
define([
    'exports',
    'react',
    'can-compute',
    'can-define/map'
], function (exports, _react, _canCompute, _canDefineMap) {
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
    var _compute = _interopRequireDefault(_canCompute);
    var _DefineMap = _interopRequireDefault(_canDefineMap);
    function connect(MapToProps, ComponentToConnect) {
        var ConnectedComponent = function (_React$Component) {
            _inherits(ConnectedComponent, _React$Component);
            function ConnectedComponent(props) {
                var _this = this;
                _classCallCheck(this, ConnectedComponent);
                _get(Object.getPrototypeOf(ConnectedComponent.prototype), 'constructor', this).call(this, props);
                this.propsCompute = (0, _compute['default'])(props);
                if (MapToProps.prototype instanceof _DefineMap['default']) {
                    this.viewModel = new MapToProps(this.propsCompute());
                    this.mapToState = this.createMapToStateWithViewModel(this.viewModel);
                } else {
                    this.mapToState = this.createMapToStateWithFunction(MapToProps);
                }
                this.state = { propsForChild: this.mapToState() };
                var batchNum = undefined;
                this.mapToState.bind('change', function (ev, newVal) {
                    if (!ev.batchNum || ev.batchNum !== batchNum) {
                        _this.setState({ propsForChild: newVal });
                    }
                });
            }
            _createClass(ConnectedComponent, [
                {
                    key: 'createMapToStateWithViewModel',
                    value: function createMapToStateWithViewModel(vm) {
                        var _this2 = this;
                        return (0, _compute['default'])(function () {
                            vm.set(_this2.propsCompute());
                            var props = vm.serialize();
                            getMethodNames(vm).forEach(function (methodName) {
                                props[methodName] = vm[methodName].bind(vm);
                            });
                            return props;
                        });
                    }
                },
                {
                    key: 'createMapToStateWithFunction',
                    value: function createMapToStateWithFunction(func) {
                        var _this3 = this;
                        return (0, _compute['default'])(function () {
                            var props = _this3.propsCompute();
                            return Object.assign({}, props, func(props));
                        });
                    }
                },
                {
                    key: 'componentWillReceiveProps',
                    value: function componentWillReceiveProps(nextProps) {
                        this.propsCompute(nextProps);
                    }
                },
                {
                    key: 'render',
                    value: function render() {
                        return _React['default'].createElement(ComponentToConnect, this.state.propsForChild);
                    }
                }
            ]);
            return ConnectedComponent;
        }(_React['default'].Component);
        ConnectedComponent.displayName = 'Connected(' + getDisplayName(ComponentToConnect) + ')';
        return ConnectedComponent;
    }
    function getDisplayName(ComponentToConnect) {
        return ComponentToConnect.displayName || ComponentToConnect.name || 'Component';
    }
    function getMethodNames(obj) {
        var result = [];
        for (var key in obj) {
            try {
                if (typeof obj[key] == 'function') {
                    result.push(key);
                }
            } catch (err) {
            }
        }
        return result;
    }
});