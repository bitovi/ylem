if (process.env.NODE_ENV === 'production') {
	module.exports = require('./production/index.js');
}
else {
	module.exports = require('./development/index.js');
}
