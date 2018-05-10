import namespace from 'can-namespace';

import connect from './connect';
const withViewModel = connect;

namespace.reactViewModel = {
	connect,
	withViewModel,
};

export {
	connect,
	withViewModel,
};
