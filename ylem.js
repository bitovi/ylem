import namespace from 'can-namespace';
import { Object, Array } from 'can-observe';

import connect from './connect';
import Component from './component';
const withViewModel = connect;

namespace.reactViewModel = {
	connect,
	withViewModel,
	Component,
};

export {
	connect,
	withViewModel,
	Component,
	Object,
	Array,
};
