const canObserve = require('can-observe');

module.exports = {
	test: (config) => typeof config === 'function' && config.prototype instanceof canObserve.Object,
	createViewModel(ViewModel, props) {
		return new ViewModel(props);
	},
	updateViewModel(viewModel, nextProps) {
		Object.assign(viewModel, nextProps);
	},
	extractProps(ViewModel, viewModel) {
		const props = {};

		for (const prop of Object.getOwnPropertyNames(ViewModel.prototype)) {
			if (prop === 'constructor') {
				continue;
			}

			props[prop] = viewModel[prop];
		}

		for (const prop of Object.getOwnPropertyNames(viewModel)) {
			props[prop] = viewModel[prop];
		}

		return props;
	},
};
