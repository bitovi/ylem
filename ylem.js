import namespace from 'can-namespace';
import { Object as ObserveObject, Array as ObserveArray} from 'can-observe';

import connect from './connect/connect';
import Component from './component/component';
import createViewModelComponent from './create-view-model-component';

namespace.ylem = {
	connect,
	withViewModel: connect,
	Component,
	ObserveObject,
	ObserveArray,
	createViewModelComponent,
};

export default namespace.ylem;
export {
	connect,
	connect as withViewModel,
	Component,
	ObserveObject,
	ObserveArray,
	createViewModelComponent,
};
