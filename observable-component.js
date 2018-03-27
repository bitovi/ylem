import { Component } from 'react';
import canReflect from 'can-reflect';
import Observer from './observer';

export default class ObservableComponent extends Component {
	constructor(props) {
		super(props);

		if (this.constructor.prototype.hasOwnProperty('shouldComponentUpdate')) {
			this.constructor.prototype._shouldComponentUpdate = this.constructor.prototype.shouldComponentUpdate;
			delete this.constructor.prototype.shouldComponentUpdate;
		}

		var observer = function () {
			if (typeof this._shouldComponentUpdate !== 'function' || this._shouldComponentUpdate()) {
				this.forceUpdate();
			}
		}.bind(this);

		//!steal-remove-start
		Object.defineProperty(observer, 'name', {
			value: canReflect.getName(this),
		});
		//!steal-remove-end

		Object.defineProperty(this, '_observer', {
			writable: false,
			enumerable: false,
			configurable: false,
			value: new Observer(observer),
		});
	}

	shouldComponentUpdate() {
		return false;
	}

	componentWillMount() {
		this._observer.startRecording();
	}

	componentDidMount() {
		this._observer.stopRecording();
	}

	componentWillUpdate() {
		this._observer.startRecording();
	}

	componentDidUpdate() {
		this._observer.stopRecording();
	}

	componentWillUnmount() {
		this._observer.teardown();
	}
}
