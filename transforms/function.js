const canObserve = require('can-observe');

module.exports = {
	test: (config) => typeof config === 'function',
	createViewModel(transform, props) {
		return canObserve({ ...props });
	},
	updateViewModel(viewModel, nextProps) {
		Object.assign(viewModel, nextProps);
	},
	extractProps(transform, viewModel) {
		return transform(viewModel);
	},
};
