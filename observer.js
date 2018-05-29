import canReflect from 'can-reflect';
import ObservationRecorder from 'can-observation-recorder';
import recorderHelpers from 'can-observation/recorder-dependency-helpers';
import queues from 'can-queues';

var ORDER = undefined;

export default function Observer(onUpdate) {
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
		if(!deps.ylem){
			throw new Error(
				'If you see this error with another error, clearing that should solve this. If you see '
				+ 'this error alone, please open and issue on our github and tag Christopher and Justin.'
			);
		}
	}

	this.oldDependencies = this.newDependencies;
	this.nextDependencies = ObservationRecorder.start();
	this.nextDependencies.ylem = true;
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
};

Observer.prototype.stopRecording = function() {
	if(weLeftSomethingOnTheStack){
		var deps = ObservationRecorder.stop();
		weLeftSomethingOnTheStack = false;

		if(!deps.ylem){
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
	recorderHelpers.stopObserving(this.newDependencies, this.onDependencyChange);
	queues.deriveQueue.dequeue(this.onUpdate);
};

Observer.prototype.ignore = function(fn) {
	return ObservationRecorder.ignore(fn)();
};

//!steal-remove-start
canReflect.assignSymbols(Observer.prototype, {
	'can.getName': function() {
		return canReflect.getName(this.constructor) + '<' + canReflect.getName(this.onUpdate) + '>';
	},
});
//!steal-remove-end
