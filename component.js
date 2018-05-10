import observe from 'can-observe';
import reflect from 'can-reflect';
import ObservableComponent from './observable-component';

class Component extends ObservableComponent {
	constructor() {
		super();

		let state = observe({});
		Object.defineProperty(this, 'state', {
			get() {
				return state;
			},
			set(obj) {
				if (Object.prototype.toString.call(obj) !== '[object Object]') {
					throw new Error('You must set state to an object');
				}

				if (reflect.isObservableLike(obj)) {
					state = obj;
					return;
				}

				Object.assign(state, obj);
			},
			enumerable: true,
			configurable: false
		});
	}
}

export default Component;
