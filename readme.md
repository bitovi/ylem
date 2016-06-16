# can-react

[![Build Status](https://travis-ci.org/bigab/can-react.png?branch=master)](https://travis-ci.org/bigab/can-react)


## Usage

### ES6 use

With StealJS, you can import this module directly in a template that is autorendered:

```js
import plugin from '@bigab/can-react';
```

### CommonJS use

Use `require` to load `@bigab/can-react` and everything else
needed to create a template that uses `@bigab/can-react`:

```js
var plugin = require("@bigab/can-react");
```

## AMD use

Configure the `can` and `jquery` paths and the `@bigab/can-react` package:

```html
<script src="require.js"></script>
<script>
	require.config({
	    paths: {
	        "jquery": "node_modules/jquery/dist/jquery",
	        "can": "node_modules/canjs/dist/amd/can"
	    },
	    packages: [{
		    	name: '@bigab/can-react',
		    	location: 'node_modules/@bigab/can-react/dist/amd',
		    	main: 'lib/bigab-can-react'
	    }]
	});
	require(["main-amd"], function(){});
</script>
```

### Standalone use

Load the `global` version of the plugin:

```html
<script src='./node_modules/@bigab/can-react/dist/global/@bigab/can-react.js'></script>
```

## Contributing

### Making a Build

To make a build of the distributables into `dist/` in the cloned repository run

```
npm install
node build
```

### Running the tests

Tests can run in the browser by opening a webserver and visiting the `test.html` page.
Automated tests that run the tests from the command line in Firefox can be run with

```
npm test
```
