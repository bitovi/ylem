const DefineMap = require('can-define/map/map');

module.exports = {
	test: (config) => typeof config === 'function' && config.prototype instanceof DefineMap,
	createViewModel(ViewModel, props) {
		return new ViewModel(props);
	},
	updateViewModel(viewModel, nextProps) {
		Object.assign(viewModel, nextProps);
	},
};
