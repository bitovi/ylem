/*react-view-model@0.5.9#helpers/make-enumerable*/
define([
    'require',
    'exports',
    'module',
    'can-util/js/each'
], function (require, exports, module) {
    var each = require('can-util/js/each');
    module.exports = function makeEnumerable(Type, recursive) {
        if (isEnumerable(Type)) {
            return;
        }
        if (recursive === undefined) {
            recursive = true;
        }
        var setup = Type.prototype.setup;
        Type.prototype.setup = function () {
            if (this._define) {
                var map = this;
                each(this._define.definitions, function (value, prop) {
                    var parent = Object.getOwnPropertyDescriptor(map.constructor.prototype, prop);
                    Object.defineProperty(map, prop, {
                        enumerable: true,
                        get: parent.get,
                        set: parent.set
                    });
                    if (recursive && value.Type) {
                        makeEnumerable(value.Type, recursive);
                    }
                });
            }
            return setup.apply(this, arguments);
        };
        Object.defineProperty(Type, '__isEnumerable', {
            enumerable: false,
            value: true
        });
    };
    function isEnumerable(Type) {
        return !!Type.__isEnumerable;
    }
    module.exports.isEnumerable = isEnumerable;
});