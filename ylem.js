import namespace from 'can-namespace';
import { Object as Model, Array as ModelList} from 'can-observe';

import connect from './connect';
import Component from './component';
import createViewModelComponent from './create-view-model-component';

namespace.ylem = {
	connect,
	withViewModel: connect,
	Component,
	ViewModel: Model,
	Model,
	ModelList,
	createViewModelComponent,
};

export default namespace.ylem;
export {
	connect,
	connect as withViewModel,
	Component,
	Model as ViewModel,
	Model,
	ModelList,
	createViewModelComponent,
};
