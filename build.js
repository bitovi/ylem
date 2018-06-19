const stealTools = require('steal-tools');

stealTools.export({
	steal: {
		config: `${__dirname}/package.json!npm`
	},
	outputs: {
		'development+cjs': {
			removeDevelopmentCode: false,
			dest: `${__dirname}/dist/development`,
		},
		'production+cjs': {
			removeDevelopmentCode: true,
			dest: `${__dirname}/dist/production`,
		},
	}
}).catch(function(e){

	setTimeout(function(){
		throw e;
	}, 1);

});
