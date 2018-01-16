const DefineMap = require('can-define/map/map');

module.exports = {
	test: (config) => typeof config === 'function' && config.prototype instanceof DefineMap,
	createViewModel(ViewModel, props) {
		return new ViewModel(props);
	},
	updateViewModel(viewModel, nextProps) {
		Object.assign(viewModel, nextProps);
	},
	extractProps(ViewModel, viewModel) {
		const props = {};

		if (viewModel._define) {
			for (const prop in viewModel._define.definitions) {
				props[prop] = viewModel[prop];
			}

			for (const prop in viewModel._define.methods) {
				if (prop === 'constructor' || prop === 'init') {
					continue;
				}

				props[prop] = viewModel[prop];
			}
		}

		return props;
	},
};
