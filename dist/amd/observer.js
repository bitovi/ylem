/*react-view-model@1.0.0-pre.0#observer*/
define([
    'require',
    'exports',
    'module',
    'can-reflect',
    'can-observation-recorder',
    'can-observation/recorder-dependency-helpers',
    'can-queues'
], function (require, exports, module) {
    var canReflect = require('can-reflect');
    var ObservationRecorder = require('can-observation-recorder');
    var recorderHelpers = require('can-observation/recorder-dependency-helpers');
    var queues = require('can-queues');
    var ORDER = undefined;
    function Observer(onUpdate) {
        this.newDependencies = ObservationRecorder.makeDependenciesRecorder();
        this.oldDependencies = null;
        this.onUpdate = onUpdate;
        var self = this;
        this.onDependencyChange = function (newVal, oldVal) {
            self.dependencyChange(this, newVal, oldVal);
        };
    }
    Observer.prototype.startRecording = function () {
        this.oldDependencies = this.newDependencies;
        ObservationRecorder.start();
        if (this.order !== undefined) {
            ORDER = this.order;
        } else {
            if (ORDER !== undefined) {
                this.order = ++ORDER;
            } else {
                this.order = ORDER = 0;
            }
        }
    };
    Observer.prototype.stopRecording = function () {
        this.newDependencies = ObservationRecorder.stop();
        recorderHelpers.updateObservations(this);
    };
    Observer.prototype.dependencyChange = function () {
        queues.deriveQueue.enqueue(this.onUpdate, this, [], { priority: this.order });
    };
    Observer.prototype.teardown = function () {
        queues.priorityQueue.dequeue(this.onUpdate);
    };
    module.exports = Observer;
});