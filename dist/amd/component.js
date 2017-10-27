/*react-view-model@1.0.0-pre.0#component*/
define([
    'require',
    'exports',
    'module',
    'react',
    'can-reflect',
    'can-define/map',
    'can-util/js/assign',
    './observer',
    './helpers/make-enumerable',
    './helpers/autobind-methods',
    'can-util/js/dev',
    'can-namespace'
], function (require, exports, module) {
    var React = require('react');
    var canReflect = require('can-reflect');
    var DefineMap = require('can-define/map');
    var assign = require('can-util/js/assign');
    var Observer = require('./observer');
    var makeEnumerable = require('./helpers/make-enumerable');
    var autobindMethods = require('./helpers/autobind-methods');
    var dev = require('can-util/js/dev');
    var namespace = require('can-namespace');
    if (React) {
        var Component = function Component() {
            React.Component.call(this);
            if (this.constructor.ViewModel) {
                autobindMethods(this.constructor.ViewModel, true);
                if (!makeEnumerable.isEnumerable(this.constructor.ViewModel)) {
                    makeEnumerable(this.constructor.ViewModel, true);
                }
            }
            var observer = function () {
                if (typeof this._shouldComponentUpdate !== 'function' || this._shouldComponentUpdate()) {
                    this.forceUpdate();
                }
            }.bind(this);
            this._observer = new Observer(observer);
            if (typeof this.shouldComponentUpdate === 'function') {
                this._shouldComponentUpdate = this.shouldComponentUpdate;
            }
            this.shouldComponentUpdate = function () {
                return false;
            };
        };
        Component.prototype = Object.create(React.Component.prototype);
        Component.prototype.constructor = Component;
        assign(Component.prototype, {
            constructor: Component,
            componentWillReceiveProps: function (nextProps) {
                var props = {};
                for (var key in nextProps) {
                    if (!(key in this.props) || nextProps[key] !== this.props[key]) {
                        props[key] = nextProps[key];
                    }
                }
                this.viewModel.assign(props);
            },
            componentWillMount: function () {
                var ViewModel = this.constructor.ViewModel || DefineMap;
                this.viewModel = new ViewModel(this.props);
                this._observer.startRecording();
            },
            componentDidMount: function () {
                this._observer.stopRecording();
            },
            componentWillUpdate: function () {
                this._observer.startRecording();
            },
            componentDidUpdate: function () {
                this._observer.stopRecording();
            },
            componentWillUnmount: function () {
                this._observer.teardown();
                this.viewModel = null;
            }
        });
        module.exports = namespace.ReactViewModelComponent = Component;
    } else {
        module.exports = namespace.ReactViewModelComponent = function Component() {
            throw new Error('You must provide React before can.all.js');
        };
    }
});