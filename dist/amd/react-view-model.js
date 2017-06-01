/*react-view-model@0.3.0#react-view-model*/
define([
    'exports',
    'react',
    'can-define/map',
    './observer',
    './make-enumerable',
    'can-util/js/dev'
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
                    this.viewModel = new ViewModel(this.props);
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
                        return _render(this.viewModel);
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