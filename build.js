var stealTools = require("steal-tools");

stealTools.export({
	system: {
		config: __dirname + "/package.json!npm"
	},
	outputs: {
		"+cjs": {},
		"+amd": {},
		"+global-js": {}
	}
}).catch(function(e){
	
	setTimeout(function(){
		throw e;
	},1);
	
});
