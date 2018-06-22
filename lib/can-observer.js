import canReflect from 'can-reflect';
import ObservationRecorder from 'can-observation-recorder';
import recorderHelpers from 'can-observation/recorder-dependency-helpers';
import queues from 'can-queues';

let ORDER = undefined;
let weLeftSomethingOnTheStack = false;

export default class Observer {
	constructor(onUpdate) {
		this.newDependencies = ObservationRecorder.makeDependenciesRecorder();
		this.oldDependencies = null;
		this.onUpdate = onUpdate;

		this.onDependencyChange = (newVal, oldVal) => {
			this.dependencyChange(newVal, oldVal);
		};
	}

	startRecording() {
		if (weLeftSomethingOnTheStack) {
			const deps = ObservationRecorder.stop();
			weLeftSomethingOnTheStack = false;

			if (!deps.ylem) {
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

		if (this.order !== undefined) {
			ORDER = this.order;
		}
		else {
			if (ORDER !== undefined) {
				this.order = ++ORDER;
			}
			else {
				// the root component
				this.order = ORDER = 0;
			}
		}
	}

	stopRecording() {
		if (weLeftSomethingOnTheStack) {
			const deps = ObservationRecorder.stop();
			weLeftSomethingOnTheStack = false;

			if (!deps.ylem) {
				throw new Error(
					'If you see this error with another error, clearing that should solve this. If you see '
					+ 'this error alone, please open and issue on our github and tag Christopher and Justin.'
				);
			}
		}

		this.newDependencies = this.nextDependencies;
		recorderHelpers.updateObservations(this);
	}

	dependencyChange() {
		queues.deriveQueue.enqueue(this.onUpdate, this, [], { priority: this.order });
	}

	teardown() {
		recorderHelpers.stopObserving(this.newDependencies, this.onDependencyChange);
		queues.deriveQueue.dequeue(this.onUpdate);
	}

	ignore(fn) {
		return ObservationRecorder.ignore(fn)();
	}
}

//!steal-remove-start
canReflect.assignSymbols(Observer.prototype, {
	'can.getName': function() {
		return `${canReflect.getName(this.constructor)}<${canReflect.getName(this.onUpdate)}>`;
	},
});
//!steal-remove-end
