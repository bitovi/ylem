## Getting Started with NPM and StealJS

To use **ylem** with NPM and StealJS, simply install the steal suite, react, and ylem.

```sh
npm install steal steal-tools done-serve --save-dev
npm install react react-dom ylem --save
```

You will need to add a `steal` section to your `package.json`. We recommend using the `transform-class-properties` babel plugin to enable simpler callbacks and PropTypes. To simplify your development cycle, we have also included two scripts below.

```json
{
  "main": "index.js",
  "scripts": {
    "develop": "done-serve --develop",
    "build": "steal-tools build"
  },
  "steal": {
    "babelOptions": {
      "plugins": [
        "transform-class-properties"
      ]
    }
  }
}
```

You will also need an `index.html` to load in the browser.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>ylem Demo</title>
  </head>
  <body>
    <div id="app"></div>
    <script src="node_modules/steal/steal.js"></script>
  </body>
</html>
```

From here, you need only create your `index.js`, run `npm run develop`, and open it in your browser (http://localhost:8080).

```js
import React from 'react';
import ReactDOM from 'react-dom';
import ylem, { ObserveObject } from 'ylem';

class AppState extends ObserveObject {
    user = null
    
    login = () => {
        this.user = { name: 'yetti' };
    }
}

const App = ylem(AppState, (props) => (
    <div>
    	<button onClick={props.login}>Login</button>
    	{props.user && 
    		<div>Welcome {props.user.name}!</div>
    	}
    </div>
));

ReactDOM.render(<App />, document.getElementById('app'));
```

Want to learn more about StealJS? [Check out the docs!](https://stealjs.com/docs/)
