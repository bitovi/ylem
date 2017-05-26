import DefineMap from 'can-define/map/map';
import observeReader from "can-observation/reader/reader";

export default DefineMap.extend('PromiseViewModel', {
	init(promise) {
		this.promise = promise;
	},

	promise: "any",
	isPending: {
		get() {
			return observeReader.read(this, observeReader.reads("promise.isPending")).value;
		}
	},
	isResolved: {
		get() {
			return observeReader.read(this, observeReader.reads("promise.isResolved")).value;
		}
	},
	isRejected: {
		get() {
			return observeReader.read(this, observeReader.reads("promise.isRejected")).value;
		}
	},
	reason: {
		get() {
			return observeReader.read(this, observeReader.reads("promise.reason")).value;
		}
	},
	value: {
		get() {
			return observeReader.read(this, observeReader.reads("promise.value")).value;
		}
	}
});
