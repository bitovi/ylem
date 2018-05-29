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
import { Component } from 'ylem';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  increment = () => {
    this.state.count++;
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Count: {this.state.count}
          </p>
          <a className="App-link" onClick={this.increment}>+1</a>
        </header>
      </div>
    );
  }
}

export default App;
```
