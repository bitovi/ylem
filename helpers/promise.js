import DefineMap from 'can-define/map/map';
import observeReader from "can-observation/reader/reader";

const PromiseViewModel = DefineMap.extend({
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
	value: {
		get() {
			return observeReader.read(this, observeReader.reads("promise.value")).value;
		}
	}
});

export default function promise(getPromise) {
	return {
		value: new PromiseViewModel({
			promise: getPromise()
		})
	};
}
