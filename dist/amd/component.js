/*react-view-model@0.5.8#component*/
define([
    'require',
    'exports',
    'module',
    'react',
    'can-define/map',
    'can-util/js/assign',
    './observer',
    './make-enumerable',
    './helpers/autobind-methods',
    'can-util/js/dev',
    'can-namespace'
], function (require, exports, module) {
    var React = require('react');
    var DefineMap = require('can-define/map');
    var assign = require('can-util/js/assign');
    var Observer = require('./observer');
    var makeEnumerable = require('./make-enumerable');
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
            this._observer = new Observer();
            if (typeof this.shouldComponentUpdate === 'function') {
                this._shouldComponentUpdate = this.shouldComponentUpdate;
            }
            this.shouldComponentUpdate = function () {
                return false;
            };
        };
        Component.prototype = Object.create(React.Component.prototype);
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
                this._observer.startLisening(function () {
                    if (typeof this._shouldComponentUpdate !== 'function' || this._shouldComponentUpdate()) {
                        this.forceUpdate();
                    }
                }.bind(this));
            },
            componentDidMount: function () {
                this._observer.stopListening();
            },
            componentWillUpdate: function () {
                this._observer.startLisening();
            },
            componentDidUpdate: function () {
                this._observer.stopListening();
            },
            componentWillUnmount: function () {
                this._observer.stop();
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