/*react-view-model@0.5.6#react-view-model*/
define(function (require, exports, module) {
    var assign = require('can-util/js/assign');
    var Component = require('./component');
    var namespace = require('can-namespace');
    module.exports = namespace.reactViewModel = function reactViewModel(displayName, ViewModel, render) {
        if (arguments.length === 1) {
            render = arguments[0];
            ViewModel = null;
            displayName = null;
        }
        if (arguments.length === 2) {
            render = arguments[1];
            if (typeof arguments[0] === 'string') {
                displayName = arguments[0];
                ViewModel = null;
            } else {
                ViewModel = arguments[0];
                displayName = null;
            }
        }
        if (!displayName) {
            displayName = (render.displayName || render.name || 'ReactVMComponent') + 'Wrapper';
        }
        function App() {
            Component.call(this);
        }
        App.ViewModel = ViewModel;
        App.displayName = displayName;
        App.prototype = Object.create(Component.prototype);
        assign(App.prototype, {
            constructor: App,
            render: function () {
                return render(this.viewModel);
            }
        });
        try {
            Object.defineProperty(App, 'name', {
                writable: false,
                enumerable: false,
                configurable: true,
                value: displayName
            });
        } catch (e) {
        }
        return App;
    };
});