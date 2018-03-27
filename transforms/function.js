import canObserve from 'can-observe';

export default {
	test: (config) => typeof config === 'function',
	createViewModel(transform, props) {
		return canObserve(Object.assign({}, props));
	},
	updateViewModel(viewModel, nextProps) {
		Object.assign(viewModel, nextProps);
	},
	extractProps(transform, viewModel) {
		return transform(viewModel);
	},
};
