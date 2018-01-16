const canObserve = require('can-observe');

module.exports = {
	test: (config) => typeof config === 'object' && config !== null,
	createViewModel(defaults, props) {
		return canObserve({ ...props });
	},
	updateViewModel(viewModel, nextProps) {
		Object.assign(viewModel, nextProps);
	},
	extractProps(defaults, viewModel) {
		return {
			...defaults,
			...viewModel,
		};
	},
};
