/*react-view-models@0.0.4#react-view-models*/
define([
    'exports',
    'react',
    'can-compute',
    'can-define/map'
], function (exports, _react, _canCompute, _map) {
    'use strict';
    Object.defineProperty(exports, '__esModule', { value: true });
    exports.connect = connect;
    var _react2 = _interopRequireDefault(_react);
    var _canCompute2 = _interopRequireDefault(_canCompute);
    var _map2 = _interopRequireDefault(_map);
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
    function connect(MapToProps, ComponentToConnect) {
        if (typeof MapToProps !== 'function') {
            throw new Error('Setting the viewmodel to an instance or value is not supported');
        }
        var ConnectedComponent = function (_React$Component) {
            _inherits(ConnectedComponent, _React$Component);
            function ConnectedComponent(props) {
                _classCallCheck(this, ConnectedComponent);
                var _this = _possibleConstructorReturn(this, (ConnectedComponent.__proto__ || Object.getPrototypeOf(ConnectedComponent)).call(this, props));
                if (MapToProps.prototype instanceof _map2.default) {
                    _this.viewModel = new MapToProps(props);
                    _this.createMethodMixin();
                    _this.computedState = _this.computedStateFromViewModel();
                } else {
                    _this.propsCompute = (0, _canCompute2.default)(props);
                    _this.computedState = _this.computedStateFromFunction(MapToProps);
                }
                _this.state = { propsForChild: _this.computedState() };
                _this.bindToComputedState();
                return _this;
            }
            _createClass(ConnectedComponent, [
                {
                    key: 'computedStateFromViewModel',
                    value: function computedStateFromViewModel() {
                        var _this2 = this;
                        return (0, _canCompute2.default)(function () {
                            var vm = _this2.viewModel;
                            var props = vm.serialize();
                            return Object.assign({}, _this2.methodMixin, props);
                        });
                    }
                },
                {
                    key: 'computedStateFromFunction',
                    value: function computedStateFromFunction(MapToPropsFunc) {
                        var _this3 = this;
                        return (0, _canCompute2.default)(function () {
                            var props = _this3.propsCompute();
                            return Object.assign({}, props, MapToPropsFunc(props));
                        });
                    }
                },
                {
                    key: 'bindToComputedState',
                    value: function bindToComputedState() {
                        var _this4 = this;
                        var batchNum = void 0;
                        this.computedState.bind('change', function (ev, newVal) {
                            if (!ev.batchNum || ev.batchNum !== batchNum) {
                                batchNum = ev.batchNum;
                                _this4.setState({ propsForChild: newVal });
                            }
                        });
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
                    key: 'createMethodMixin',
                    value: function createMethodMixin() {
                        var vm = this.viewModel;
                        var methodMixin = {};
                        getMethodNames(vm).forEach(function (methodName) {
                            methodMixin[methodName] = vm[methodName].bind(vm);
                        });
                        this.methodMixin = methodMixin;
                    }
                },
                {
                    key: 'render',
                    value: function render() {
                        return _react2.default.createElement(ComponentToConnect, this.state.propsForChild, this.props.children);
                    }
                }
            ]);
            return ConnectedComponent;
        }(_react2.default.Component);
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
                if (typeof obj[key] === 'function') {
                    result.push(key);
                }
            } catch (err) {
            }
        }
        return result;
    }
});