/*@bigab/can-react@0.0.0#can-react*/
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
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
var _canComputeCompute = require('can/compute/compute');
var _canComputeCompute2 = _interopRequireDefault(_canComputeCompute);
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
            this.propsCompute = (0, _canComputeCompute2['default'])(props);
            this.compute = (0, _canComputeCompute2['default'])(function () {
                return mapToState(_this.propsCompute());
            });
            this.state = this.compute();
            this.compute.bind('change', function (ev, newVal) {
                _this.setState(newVal);
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
                    return _react2['default'].createElement(ComponentToConnect, this.state);
                }
            }
        ]);
        return ConnectedComponent;
    }(_react2['default'].Component);
    ConnectedComponent.displayName = connectDisplayName;
    return ConnectedComponent;
}
function getDisplayName(ComponentToConnect) {
    return ComponentToConnect.displayName || ComponentToConnect.name || 'Component';
}