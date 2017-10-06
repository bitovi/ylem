import DefineMap from "can-define/map/map";
import observeReader from "can-stache-key";

export default DefineMap.extend("ObservablePromise", {
	init: function(promise) {
		this.promise = promise;
	},

	promise: "any",
	isPending: {
		get: function() {
			return observeReader.read(this, observeReader.reads("promise.isPending")).value;
		}
	},
	isResolved: {
		get: function() {
			return observeReader.read(this, observeReader.reads("promise.isResolved")).value;
		}
	},
	isRejected: {
		get: function() {
			return observeReader.read(this, observeReader.reads("promise.isRejected")).value;
		}
	},
	reason: {
		get: function() {
			return observeReader.read(this, observeReader.reads("promise.reason")).value;
		}
	},
	value: {
		get: function() {
			return observeReader.read(this, observeReader.reads("promise.value")).value;
		}
	}
});
