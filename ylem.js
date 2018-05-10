import namespace from 'can-namespace';

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
};
