/*test/test*/
'use strict';
var _stealQunit = require('steal-qunit@1.0.0#steal-qunit');
var _stealQunit2 = _interopRequireDefault(_stealQunit);
var _reactViewModels = require('react-view-models');
var _reactViewModels2 = _interopRequireDefault(_reactViewModels);
var _react = require('react@15.4.2#react');
var _react2 = _interopRequireDefault(_react);
var _canCompute = require('can-compute@3.0.5#can-compute');
var _canCompute2 = _interopRequireDefault(_canCompute);
var _reactAddonsTestUtils = require('react-addons-test-utils@15.4.2#index');
var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);
var _map = require('can-define@1.0.15#map/map');
var _map2 = _interopRequireDefault(_map);
var _list = require('can-define@1.0.15#list/list');
var _list2 = _interopRequireDefault(_list);
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
        _stealQunit2.default.module('with a mapToProps function', function () {
            _stealQunit2.default.test('should not (by default) render additional dom nodes that the ones from the extended Presentational Component', function (assert) {
                var ConnectedComponent = (0, _reactViewModels2.default)(function () {
                    return { value: 'bar' };
                }, TestComponent);
                shallowRenderer.render(_react2.default.createElement(ConnectedComponent, { value: 'foo' }));
                var result = shallowRenderer.getRenderOutput();
                assert.equal(result.type, TestComponent);
                assert.equal(result.props.value, 'bar');
            });
            _stealQunit2.default.test('should update the component whenever an observable read inside the mapToProps function emits a change event', function (assert) {
                var observable = (0, _canCompute2.default)('Inital Value');
                var ConnectedComponent = (0, _reactViewModels2.default)(function () {
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
                var ConnectedComponent = (0, _reactViewModels2.default)(function (_ref) {
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
                    }
                },
                zzz: {
                    set: function set(newVal) {
                        return newVal.toUpperCase();
                    }
                },
                list: { value: new _list2.default(['one']) },
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
                    }
                }
            });
            _stealQunit2.default.test('should assign a property to the component called `viewModel` with an instance of ViewModel as the value', function (assert) {
                var ConnectedComponent = (0, _reactViewModels2.default)(DefinedViewModel, TestComponent);
                var connectedInstance = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(ConnectedComponent));
                assert.ok(connectedInstance.viewModel instanceof DefinedViewModel);
            });
            _stealQunit2.default.test('should update whenever any observable property on the viewModel instance changes', function (assert) {
                var properties = { foobar: true };
                var ConnectedComponent = (0, _reactViewModels2.default)(DefinedViewModel, TestComponent, { properties: properties });
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
                var properties = { bar: true };
                var ConnectedComponent = (0, _reactViewModels2.default)(DefinedViewModel, TestComponent, { properties: properties });
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
                var properties = {
                    bar: true,
                    foobar: true
                };
                var ConnectedComponent = (0, _reactViewModels2.default)(DefinedViewModel, TestComponent, { properties: properties });
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
                var properties = { foobar: true };
                var ConnectedComponent = (0, _reactViewModels2.default)(DefinedViewModel, TestComponent, { properties: properties });
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
                var properties = { interceptedCallback: true };
                var ConnectedComponent = (0, _reactViewModels2.default)(DefinedViewModel, TestComponent, { properties: properties });
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
                var properties = { zzz: true };
                var ConnectedComponent = (0, _reactViewModels2.default)(DefinedViewModel, TestComponent, { properties: properties });
                var el = _react2.default.createElement(ConnectedComponent, { zzz: 'zzz' });
                var connectedInstance = _reactAddonsTestUtils2.default.renderIntoDocument(el);
                var childComponent = _reactAddonsTestUtils2.default.scryRenderedComponentsWithType(connectedInstance, TestComponent)[0];
                assert.equal(childComponent.props.zzz, 'ZZZ');
            });
            _stealQunit2.default.module('OPTIONS \'properties\'', function () {
                _stealQunit2.default.test('should pass vm \'keys\' with a truthy value in the \'properties\' object to the connected component', function (assert) {
                    var properties = {
                        foo: false,
                        bar: true
                    };
                    var ConnectedComponent = (0, _reactViewModels2.default)(DefinedViewModel, TestComponent, { properties: properties });
                    var el = _react2.default.createElement(ConnectedComponent, {
                        bar: 'bar',
                        foo: 'foo'
                    });
                    var connectedInstance = _reactAddonsTestUtils2.default.renderIntoDocument(el);
                    var childComponent = _reactAddonsTestUtils2.default.scryRenderedComponentsWithType(connectedInstance, TestComponent)[0];
                    assert.equal(childComponent.props.foo, undefined);
                    assert.equal(childComponent.props.bar, 'bar');
                });
                _stealQunit2.default.test('should pass a props object with methods that have been bound\n                    the correct context (the viewmodel) for callbacks', function (assert) {
                    var ConnectedComponent = (0, _reactViewModels2.default)(DefinedViewModel, TestComponent, { properties: { returnContext: true } });
                    var connectedInstance = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(ConnectedComponent));
                    var childComponent = _reactAddonsTestUtils2.default.scryRenderedComponentsWithType(connectedInstance, TestComponent)[0];
                    assert.equal(childComponent.props.returnContext(), connectedInstance.viewModel);
                });
                _stealQunit2.default.test('should pass vm \'keys\' with the *special value* \'nobind\' in the\n                    \'properties\' object to the connected component without binding\n                    the method to the vm', function (assert) {
                    var ConnectedComponent = (0, _reactViewModels2.default)(DefinedViewModel, TestComponent, { properties: { returnContext: _reactViewModels.nobind } });
                    var connectedInstance = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(ConnectedComponent));
                    var childComponent = _reactAddonsTestUtils2.default.scryRenderedComponentsWithType(connectedInstance, TestComponent)[0];
                    var ctx = {};
                    assert.notEqual(childComponent.props.returnContext.call(ctx), connectedInstance.viewModel);
                    assert.equal(childComponent.props.returnContext.call(ctx), ctx);
                });
                _stealQunit2.default.test('should pass vm \'keys\' with the *special value* \'asArray\' in the\n                    \'properties\' object to the connected component after converting\n                    array-like objects (like DefineLists) to an actual array', function (assert) {
                    var ConnectedComponent = (0, _reactViewModels2.default)(DefinedViewModel, TestComponent, { properties: { list: _reactViewModels.asArray } });
                    var connectedInstance = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(ConnectedComponent));
                    var childComponent = _reactAddonsTestUtils2.default.scryRenderedComponentsWithType(connectedInstance, TestComponent)[0];
                    assert.equal(Object.getPrototypeOf(childComponent.props.list), Array.prototype);
                });
                _stealQunit2.default.test('should pass all remaining ownProps to the child component if\n                    the special key \'...\' is truthy', function (assert) {
                    var ownProps = {
                        someProp: 'Here is something',
                        anotherProp: 3,
                        bar: 'bar',
                        foobar: 'This should get overwritten by view-models foo'
                    };
                    var properties = {
                        '...': true,
                        'foobar': true
                    };
                    var ConnectedComponent = (0, _reactViewModels2.default)(DefinedViewModel, TestComponent, { properties: properties });
                    var connectedInstance = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(ConnectedComponent, ownProps));
                    var childComponent = _reactAddonsTestUtils2.default.scryRenderedComponentsWithType(connectedInstance, TestComponent)[0];
                    assert.equal(childComponent.props.someProp, ownProps.someProp);
                    assert.equal(childComponent.props.anotherProp, ownProps.anotherProp);
                    assert.equal(childComponent.props.foobar, 'foobar');
                });
                _stealQunit2.default.test('should not pass certain ownProps to the child component if\n                    the special key \'...\' is truthy, but the properties key is false', function (assert) {
                    var ownProps = {
                        someProp: 'Here is something',
                        anotherProp: 3
                    };
                    var properties = {
                        '...': true,
                        'anotherProp': false
                    };
                    var ConnectedComponent = (0, _reactViewModels2.default)(DefinedViewModel, TestComponent, { properties: properties });
                    var connectedInstance = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(ConnectedComponent, ownProps));
                    var childComponent = _reactAddonsTestUtils2.default.scryRenderedComponentsWithType(connectedInstance, TestComponent)[0];
                    assert.equal(childComponent.props.someProp, ownProps.someProp);
                    assert.equal(childComponent.props.anotherProp, undefined);
                });
            });
            _stealQunit2.default.module('OPTIONS \'deepObserve\'', function () {
                _stealQunit2.default.test('should be able to update the component, when a nested observable\n                    property changes, if the \'deepObserve\' options is true', function (assert) {
                    var Person = _map2.default.extend({
                        name: {
                            type: 'string',
                            value: 'Adam'
                        }
                    });
                    var DefinedViewModel = _map2.default.extend({ person: { Value: Person } });
                    var properties = { person: true };
                    var Component = function Component(_ref2) {
                        var person = _ref2.person;
                        return _react2.default.createElement('div', { className: 'person-div' }, person.name);
                    };
                    Component.propTypes = { person: _react2.default.PropTypes.any };
                    var ConnectedComponent = (0, _reactViewModels2.default)(DefinedViewModel, Component, {
                        properties: properties,
                        deepObserve: true
                    });
                    var el = _react2.default.createElement(ConnectedComponent, {});
                    var connectedInstance = _reactAddonsTestUtils2.default.renderIntoDocument(el);
                    var div = _reactAddonsTestUtils2.default.scryRenderedDOMComponentsWithTag(connectedInstance, 'div')[0];
                    assert.equal(div.textContent, 'Adam');
                    connectedInstance.viewModel.person.name = 'Marshall';
                    assert.equal(div.textContent, 'Marshall');
                });
            });
        });
        _stealQunit2.default.module('OPTIONS \'displayName\'', function (hooks) {
            var origDisplayName = void 0;
            hooks.beforeEach(function () {
                origDisplayName = TestComponent.displayName;
                TestComponent.displayName = '???';
            });
            hooks.afterEach(function () {
                TestComponent.displayName = origDisplayName;
            });
            _stealQunit2.default.test('should set the components \'displayName\' for React Dev tools when set in\n                  the options', function (assert) {
                var expectedValue = 'ThisIsTheComponentName';
                var DefinedViewModel = _map2.default.extend({});
                var ConnectedComponent = (0, _reactViewModels2.default)(DefinedViewModel, TestComponent, { displayName: expectedValue });
                assert.equal(ConnectedComponent.displayName, expectedValue);
            });
            _stealQunit2.default.test('should set the components \'displayName\' to a default value wrapping\n                  the child components \'displayName\' in "Connected(*)" if NOT set\n                  in the options', function (assert) {
                var expectedValue = 'Connected(???)';
                var ConnectedComponent = (0, _reactViewModels2.default)(function (p) {
                    return p;
                }, TestComponent);
                assert.equal(ConnectedComponent.displayName, expectedValue);
            });
            _stealQunit2.default.test('should set the components \'displayName\' to a default value\n                  "Connected(Component)" if the child component does not have a\n                  display name of function name', function (assert) {
                var expectedStatelessValue = 'Connected(statelessComponent)';
                var statelessComponent = function statelessComponent() {
                    return null;
                };
                var ConnectedStatelessComponent = (0, _reactViewModels2.default)(function (p) {
                    return p;
                }, statelessComponent);
                assert.equal(ConnectedStatelessComponent.displayName, expectedStatelessValue);
                var expectedValue = 'Connected(Component)';
                var ConnectedComponent = (0, _reactViewModels2.default)(function (p) {
                    return p;
                }, function () {
                    return null;
                });
                assert.equal(ConnectedComponent.displayName, expectedValue);
            });
        });
    });
});
//# sourceMappingURL=test.js.map