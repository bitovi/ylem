import DefineMap from 'can-define/map/map';

export default {
	test: (config) => typeof config === 'function' && config.prototype instanceof DefineMap,
	createViewModel(ViewModel, props) {
		return new ViewModel(props);
	},
	updateViewModel(viewModel, nextProps) {
		Object.assign(viewModel, nextProps);
	},
};
