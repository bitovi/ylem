var stealTools = require( "steal-tools" );

stealTools.export( {
	steal: {
		config: __dirname + "/package.json!npm"
	},
	outputs: {
		"+amd": {},
		"+global-js": {}
	}
} );
