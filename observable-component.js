import { Component } from 'react';
import canReflect from 'can-reflect';
import Observer from './observer';

export const EMPTY_OBJ = {};

export default class ObservableComponent extends Component {
	constructor(props) {
		super(props);

		this.observer = new Observer(() => {
			this.shouldUpdate = true;
			this.setState(EMPTY_OBJ);
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

	shouldComponentUpdate(props, state) {
		if (!this.observer
			|| (super.shouldComponentUpdate && !super.shouldComponentUpdate(props, state))
			|| !this.shouldUpdate) {
			return false;
		}

		this.shouldUpdate = false;

		return true;
	}

	componentDidMount() {
		this.observer.stopRecording();
	}

	componentDidUpdate() {
		this.observer.stopRecording();
	}

	componentWillUnmount() {
		this.observer.teardown();
		delete this.observer;
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
			}

			set props(props) {
				if (!this._props) {
					this._props = props;
				}
			}

			get props() {
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
