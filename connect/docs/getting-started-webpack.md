## Getting Started with NPM and Webpack

The best way to get **ylem** started with Webpack and React is with [Create React App](https://github.com/facebook/create-react-app). First make sure you have `npx` installed globally:

```sh
npm install npx -g
```

Next, generate your react app - we are calling it `my-app`:

```sh
npx create-react-app my-app
cd my-app
```

Finally, install ylem and start your app:

```
npm install ylem --save
npm start
```

From here, you can modify `src/App.js` to use the **ylem** `Component` and see the live-reload in the browser.

```js
import React from 'react';
import logo from './logo.svg';
import './App.css';
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

export default App;
```
