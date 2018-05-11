import namespace from 'can-namespace';
import { Object, Array } from 'can-observe';

import connect from './connect';
import Component from './component';
import createViewModelComponent from './create-view-model-component';

namespace.reactViewModel = {
	connect,
	withViewModel: connect,
	Component,
	Object,
	Array,
	createViewModelComponent,
};

export {
	connect,
	connect as withViewModel,
	Component,
	Object,
	Array,
	createViewModelComponent,
};
