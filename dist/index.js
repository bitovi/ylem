if (process.env.NODE_ENV === 'production') {
	module.exports = require('./production/react-view-model.js');
}
else {
	module.exports = require('./development/react-view-model.js');
}
