const canObserve = require('can-observe');

module.exports = {
	test: (config) => typeof config === 'function' && config.prototype instanceof canObserve.Object,
	createViewModel(ViewModel, props) {
		return new ViewModel(props);
	},
	updateViewModel(viewModel, nextProps) {
		Object.assign(viewModel, nextProps);
	},
	getPropTypes(config) {
		return config.propTypes;
	},
};
