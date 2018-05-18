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

export function createNewComponentClass(ViewModel, transform, render) {
	return class extends ObservableComponent {
		static getDerivedStateFromProps(nextProps, { observer, viewModel }) {
			observer.ignore(() => {
				nextProps = { ...nextProps };
				if (Array.isArray(nextProps.children)) {
					// `.children` is non-extensible
					nextProps.children = [ ...nextProps.children ];
				}

				// TODO: generic solution replacing all react components?
				if (nextProps.children) {
					// replace children, do not merge
					// idea would be to merge array, but replace items
					delete viewModel.children;
				}

				canReflect.assignDeep(viewModel, transform(nextProps));
			});

			return null;
		}

		constructor(props) {
			super(props);

			this.observer.ignore(() => {
				props = { ...props };
				if (Array.isArray(props.children)) {
					// `.children` is non-extensible
					props.children = [ ...props.children ];
				}

				this.viewModel = new ViewModel();
				canReflect.assignDeep(this.viewModel, transform(props));
			});

			this.state = {
				viewModel: this.viewModel,
				observer: this.observer
			};
		}

		shouldComponentUpdate() {
			return !!this.viewModel;
		}

		componentWillUnmount() {
			delete this.viewModel;

			super.componentWillUnmount();
		}

		render() {
			return render(this.viewModel, this.props);
		}
	};
}

export function getConnectedComponent(BaseComponent) {
	if (BaseComponent.prototype instanceof Component) {
		class ConnectedComponent extends BaseComponent {
			constructor(props) {
				const proxy = typeof Proxy === 'undefined'
					? Object.assign({}, props._vm, {
						_raw: props,
						_vm: props._vm,
					})
					: new Proxy(props._vm, {
						get(target, prop) {
							if (prop === '_raw') {
								return props;
							}
							if (prop === '_vm') {
								return target;
							}

							return target[prop];
						},
					})
				;

				super(proxy);

				//!steal-remove-start
				this._raw_props = true;
				//!steal-remove-end
			}

			//!steal-remove-start
			componentWillMount() {
				this._raw_props = false;

				if (typeof super.componentWillMount === 'function') {
					super.componentWillMount();
				}
			}
			//!steal-remove-end

			set props(props) {
				if (this._props && props === this._props._vm) {
					return;
				}

				this._props = props;
			}

			get props() {
				//!steal-remove-start
				if (this._raw_props) {
					return this._props._raw;
				}
				//!steal-remove-end

				return this._props._vm;
			}
		}

		return ConnectedComponent;
	}

	const ConnectedComponent = ({ _vm }) => {
		return BaseComponent(_vm);
	};

	return ConnectedComponent;
}
