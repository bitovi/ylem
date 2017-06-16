/*react-view-model@0.5.2#component*/
define(function (require, exports, module) {
    var ReactComponent = require('react').Component;
    var DefineMap = require('can-define/map');
    var assign = require('can-util/js/assign');
    var Observer = require('./observer');
    var makeEnumerable = require('./make-enumerable');
    var dev = require('can-util/js/dev');
    var namespace = require('can-namespace');
    function Component() {
        ReactComponent.call(this);
        if (this.constructor.ViewModel && !makeEnumerable.isEnumerable(this.constructor.ViewModel)) {
            makeEnumerable(this.constructor.ViewModel, true);
        }
        this._observer = new Observer();
        if (typeof this.shouldComponentUpdate === 'function') {
            this._shouldComponentUpdate = this.shouldComponentUpdate;
        }
        this.shouldComponentUpdate = function () {
            return false;
        };
    }
    Component.prototype = Object.create(ReactComponent.prototype);
    assign(Component.prototype, {
        constructor: Component,
        componentWillReceiveProps: function (nextProps) {
            var props = {};
            for (var key in nextProps) {
                if (!(key in this.props) || nextProps[key] !== this.props[key]) {
                    props[key] = nextProps[key];
                }
            }
            this.viewModel.set(props);
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
});