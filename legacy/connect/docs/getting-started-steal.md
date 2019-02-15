## Getting Started with NPM and StealJS

To use **ylem** ad React with NPM and StealJS, simply install the steal suite, react, and ylem.

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
    <div id="root"></div>
    <script src="node_modules/steal/steal.js"></script>
  </body>
</html>
```

Now, create an `index.js`

```js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(<App />, document.getElementById("root"));
```

...and a simple `App.js` to get started.

```js
import React from "react";

const App = () => <h1>Hello React with StealJS!</h1>;

export default App;
```

From here, you need only run `npm run develop` in your terminal, and open your browser to (http://localhost:8080).

Want to learn more about StealJS? [Check out the docs!](https://stealjs.com/docs/)
