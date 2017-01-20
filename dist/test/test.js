/*test/test*/
'use strict';
var _stealQunit = require('steal-qunit@1.0.0#steal-qunit');
var _stealQunit2 = _interopRequireDefault(_stealQunit);
var _reactViewModels = require('react-view-models');
var _react = require('react@15.4.2#react');
var _react2 = _interopRequireDefault(_react);
var _canCompute = require('can-compute@3.0.5#can-compute');
var _canCompute2 = _interopRequireDefault(_canCompute);
var _reactAddonsTestUtils = require('react-addons-test-utils@15.4.2#index');
var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);
var _map = require('can-define@1.0.15#map/map');
var _map2 = _interopRequireDefault(_map);
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}
_stealQunit2.default.module('react-view-models', function () {
    _stealQunit2.default.module('connect()', function (hooks) {
        var TestComponent = void 0;
        var shallowRenderer = void 0;
        hooks.beforeEach(function () {
            TestComponent = _react2.default.createClass({
                displayName: 'TestComponent',
                render: function render() {
                    return _react2.default.createElement('div', { className: 'test' });
                }
            });
            shallowRenderer = _reactAddonsTestUtils2.default.createRenderer();
        });
        _stealQunit2.default.module('with a map to props function', function () {
            _stealQunit2.default.test('should not (by default) render additional dom nodes that the ones from the extended Presentational Component', function (assert) {
                var ConnectedComponent = (0, _reactViewModels.connect)(function () {
                    return { value: 'bar' };
                }, TestComponent);
                shallowRenderer.render(_react2.default.createElement(ConnectedComponent, { value: 'foo' }));
                var result = shallowRenderer.getRenderOutput();
                assert.equal(result.type, TestComponent);
                assert.equal(result.props.value, 'bar');
            });
            _stealQunit2.default.test('should update the component whenever an observable read inside the mapToProps function emits a change event', function (assert) {
                var observable = (0, _canCompute2.default)('Inital Value');
                var ConnectedComponent = (0, _reactViewModels.connect)(function () {
                    return { value: observable() };
                }, TestComponent);
                var connectedInstance = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(ConnectedComponent));
                var childComponent = _reactAddonsTestUtils2.default.scryRenderedComponentsWithType(connectedInstance, TestComponent)[0];
                assert.equal(childComponent.props.value, 'Inital Value');
                observable('new value');
                assert.equal(childComponent.props.value, 'new value');
            });
            _stealQunit2.default.test('should update the component when new props are received', function (assert) {
                var observable = (0, _canCompute2.default)('Inital Observable Value');
                var ConnectedComponent = (0, _reactViewModels.connect)(function (_ref) {
                    var propValue = _ref.propValue;
                    return {
                        value: observable(),
                        propValue: propValue
                    };
                }, TestComponent);
                var WrappingComponent = _react2.default.createClass({
                    displayName: 'WrappingComponent',
                    getInitialState: function getInitialState() {
                        return { propValue: 'Initial Prop Value' };
                    },
                    changeState: function changeState() {
                        this.setState({ propValue: 'New Prop Value' });
                    },
                    render: function render() {
                        return _react2.default.createElement(ConnectedComponent, { propValue: this.state.propValue });
                    }
                });
                var wrappingInstance = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(WrappingComponent));
                var childComponent = _reactAddonsTestUtils2.default.scryRenderedComponentsWithType(wrappingInstance, TestComponent)[0];
                assert.equal(childComponent.props.propValue, 'Initial Prop Value');
                wrappingInstance.changeState();
                assert.equal(childComponent.props.propValue, 'New Prop Value');
            });
        });
        _stealQunit2.default.module('with can-define constructor function (viewModel)', function () {
            var DefinedViewModel = _map2.default.extend({
                foo: {
                    type: 'string',
                    value: 'foo'
                },
                bar: 'string',
                foobar: {
                    get: function get() {
                        return this.foo + this.bar;
                    },
                    serialize: true
                },
                zzz: {
                    set: function set(newVal) {
                        return newVal.toUpperCase();
                    }
                },
                returnContext: function returnContext() {
                    return this;
                },
                interceptedCallbackCalled: 'boolean',
                interceptedCallback: {
                    type: 'function',
                    get: function get(lastSetValue) {
                        var _this = this;
                        return function () {
                            _this.interceptedCallbackCalled = true;
                            if (lastSetValue) {
                                return lastSetValue.apply(undefined, arguments);
                            }
                        };
                    },
                    serialize: true
                }
            });
            _stealQunit2.default.test('should assign a property to the component called `viewModel` with an instance of ViewModel as the value', function (assert) {
                var ConnectedComponent = (0, _reactViewModels.connect)(DefinedViewModel, TestComponent);
                var connectedInstance = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(ConnectedComponent));
                assert.ok(connectedInstance.viewModel instanceof DefinedViewModel);
            });
            _stealQunit2.default.test('should pass a props object with copied methods, that have the correct context (the viewmodel) for callbacks', function (assert) {
                var ConnectedComponent = (0, _reactViewModels.connect)(DefinedViewModel, TestComponent);
                var connectedInstance = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(ConnectedComponent));
                var childComponent = _reactAddonsTestUtils2.default.scryRenderedComponentsWithType(connectedInstance, TestComponent)[0];
                assert.equal(childComponent.props.returnContext(), connectedInstance.viewModel);
            });
            _stealQunit2.default.test('should update whenever any observable property on the viewModel instance changes', function (assert) {
                var ConnectedComponent = (0, _reactViewModels.connect)(DefinedViewModel, TestComponent);
                var el = _react2.default.createElement(ConnectedComponent, {
                    bar: 'bar',
                    baz: 'bam'
                });
                var connectedInstance = _reactAddonsTestUtils2.default.renderIntoDocument(el);
                var childComponent = _reactAddonsTestUtils2.default.scryRenderedComponentsWithType(connectedInstance, TestComponent)[0];
                assert.equal(childComponent.props.foobar, 'foobar');
                connectedInstance.viewModel.foo = 'MMM';
                assert.equal(childComponent.props.foobar, 'MMMbar');
            });
            _stealQunit2.default.test('should update the component when new props are received', function (assert) {
                var ConnectedComponent = (0, _reactViewModels.connect)(DefinedViewModel, TestComponent);
                var WrappingComponent = _react2.default.createClass({
                    displayName: 'WrappingComponent',
                    getInitialState: function getInitialState() {
                        return { barValue: 'Initial Prop Value' };
                    },
                    changeState: function changeState() {
                        this.setState({ barValue: 'New Prop Value' });
                    },
                    render: function render() {
                        return _react2.default.createElement(ConnectedComponent, { bar: this.state.barValue });
                    }
                });
                var wrappingInstance = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(WrappingComponent));
                var childComponent = _reactAddonsTestUtils2.default.scryRenderedComponentsWithType(wrappingInstance, TestComponent)[0];
                assert.equal(childComponent.props.bar, 'Initial Prop Value');
                wrappingInstance.changeState();
                assert.equal(childComponent.props.bar, 'New Prop Value');
            });
            _stealQunit2.default.test('should update the viewModel when new props are received', function (assert) {
                var ConnectedComponent = (0, _reactViewModels.connect)(DefinedViewModel, TestComponent);
                var WrappingComponent = _react2.default.createClass({
                    displayName: 'WrappingComponent',
                    getInitialState: function getInitialState() {
                        return { bar: 'bar' };
                    },
                    changeState: function changeState() {
                        this.setState({ bar: 'BAZ' });
                    },
                    render: function render() {
                        return _react2.default.createElement(ConnectedComponent, { bar: this.state.bar });
                    }
                });
                var wrappingInstance = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(WrappingComponent));
                var childComponent = _reactAddonsTestUtils2.default.scryRenderedComponentsWithType(wrappingInstance, ConnectedComponent)[0];
                assert.equal(childComponent.viewModel.foobar, 'foobar');
                wrappingInstance.changeState();
                assert.equal(childComponent.viewModel.foobar, 'fooBAZ');
            });
            _stealQunit2.default.test('should use the viewModels props value, if the viewModel changes, and no new props are received', function (assert) {
                var ConnectedComponent = (0, _reactViewModels.connect)(DefinedViewModel, TestComponent);
                var WrappingComponent = _react2.default.createClass({
                    displayName: 'WrappingComponent',
                    getInitialState: function getInitialState() {
                        return { bar: 'bar' };
                    },
                    render: function render() {
                        return _react2.default.createElement(ConnectedComponent, { bar: this.state.bar });
                    }
                });
                var wrappingInstance = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(WrappingComponent));
                var childComponent = _reactAddonsTestUtils2.default.scryRenderedComponentsWithType(wrappingInstance, ConnectedComponent)[0];
                assert.equal(childComponent.viewModel.foobar, 'foobar');
                childComponent.viewModel.bar = 'BAZ';
                assert.equal(childComponent.viewModel.foobar, 'fooBAZ');
            });
            _stealQunit2.default.test('should be able to call the props.interceptedCallback function received from parent component', function (assert) {
                var expectedValue = [];
                var ConnectedComponent = (0, _reactViewModels.connect)(DefinedViewModel, TestComponent);
                var WrappingComponent = _react2.default.createClass({
                    displayName: 'WrappingComponent',
                    parentCallBack: function parentCallBack() {
                        return expectedValue;
                    },
                    render: function render() {
                        return _react2.default.createElement(ConnectedComponent, { interceptedCallback: this.parentCallBack });
                    }
                });
                var wrappingInstance = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(WrappingComponent));
                var connectedInstance = _reactAddonsTestUtils2.default.scryRenderedComponentsWithType(wrappingInstance, ConnectedComponent)[0];
                var childComponent = _reactAddonsTestUtils2.default.scryRenderedComponentsWithType(connectedInstance, TestComponent)[0];
                var actual = childComponent.props.interceptedCallback();
                assert.equal(actual, expectedValue, 'Value returned from wrapping components callback successfully');
                assert.equal(connectedInstance.viewModel.interceptedCallbackCalled, true, 'ViewModels interceptedCallback was called');
            });
            _stealQunit2.default.test('should be able to have the viewModel transform props before passing to child component', function (assert) {
                var ConnectedComponent = (0, _reactViewModels.connect)(DefinedViewModel, TestComponent);
                var el = _react2.default.createElement(ConnectedComponent, { zzz: 'zzz' });
                var connectedInstance = _reactAddonsTestUtils2.default.renderIntoDocument(el);
                var childComponent = _reactAddonsTestUtils2.default.scryRenderedComponentsWithType(connectedInstance, TestComponent)[0];
                assert.equal(childComponent.props.zzz, 'ZZZ');
            });
        });
    });
});
//# sourceMappingURL=test.js.map