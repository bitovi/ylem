var canReflect = require("can-reflect");
var ObservationRecorder = require("can-observation-recorder");
var recorderHelpers = require("can-observation/recorder-dependency-helpers");
var Observation = require("can-observation");
var queues = require("can-queues");

var ORDER = undefined;

function Observer(onUpdate) {
	this.newDependencies = ObservationRecorder.makeDependenciesRecorder();
	this.oldDependencies = null;
	this.onUpdate = onUpdate;

	var self = this;
	this.onDependencyChange = function(newVal, oldVal) {
		self.dependencyChange(this, newVal, oldVal);
	};
}

var weLeftSomethingOnTheStack = false;
Observer.prototype.startRecording = function() {
	if(weLeftSomethingOnTheStack){
		var deps = ObservationRecorder.stop();
		if(!deps.reactViewModel){
			throw new Error('One of these things is not like the others');
		}
	}

	this.oldDependencies = this.newDependencies;
	this.nextDependencies = ObservationRecorder.start();
	this.nextDependencies.reactViewModel = true;
	weLeftSomethingOnTheStack = true;

	if(this.order !== undefined) {
		ORDER = this.order;
	}
	else {
		if(ORDER !== undefined) {
			this.order = ++ORDER;
		}
		else {
			// the root component
			this.order = ORDER = 0;
		}
	}

	// console.log(canReflect.getName(this), this.order)
};

Observer.prototype.stopRecording = function() {
	if(weLeftSomethingOnTheStack){
		var deps = ObservationRecorder.stop();
		weLeftSomethingOnTheStack = false;

		if(!deps.reactViewModel){
			throw new Error('One of these things is not like the others');
		}
	}
	this.newDependencies = this.nextDependencies;
	recorderHelpers.updateObservations(this);
};

Observer.prototype.dependencyChange = function() {
	queues.deriveQueue.enqueue(this.onUpdate, this, [], { priority: this.order });
};

Observer.prototype.teardown = function() {
	queues.deriveQueue.dequeue(this.onUpdate);
};

Observer.prototype.ignore = function(fn) {
	Observation.ignore(fn)();
};

//!steal-remove-start
canReflect.assignSymbols(Observer.prototype, {
	"can.getName": function() {
		return canReflect.getName(this.constructor) + "<" + canReflect.getName(this.onUpdate) + ">";
	},
});
//!steal-remove-end

module.exports = Observer;
