/*react-view-models@0.0.8#react-view-models*/
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.asArray = exports.nobind = undefined;
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
exports.connect = connect;
exports.extractProps = extractProps;
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
var _canCompute = require('can-compute');
var _canCompute2 = _interopRequireDefault(_canCompute);
var _canTypes = require('can-types');
var _canUtil = require('can-util');
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}
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