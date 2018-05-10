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

		this.observer = new Observer(() => {
			if (typeof this._shouldComponentUpdate !== 'function' || this._shouldComponentUpdate()) {
				this.forceUpdate();
			}
		});

		//!steal-remove-start
		Object.defineProperty(this.observer.onUpdate, 'name', {
			value: canReflect.getName(this),
		});
		//!steal-remove-end

		const oldRender = this.render;
		this.render = function() {
			this.observer.startRecording();
			return oldRender.call(this);
		};
	}

	shouldComponentUpdate() {
		return false;
	}

	componentDidMount() {
		this.observer.stopRecording();
	}

	componentDidUpdate() {
		this.observer.stopRecording();
	}

	componentWillUnmount() {
		this.observer.teardown();
	}
}
