import canObserve from 'can-observe';

export default {
	test: (config) => typeof config === 'object' && config !== null,
	createViewModel(defaults, props) {
		return canObserve(Object.assign({}, props));
	},
	updateViewModel(viewModel, nextProps) {
		Object.assign(viewModel, nextProps);
	},
	extractProps(defaults, viewModel) {
		return Object.assign({}, defaults, viewModel);
	},
};
