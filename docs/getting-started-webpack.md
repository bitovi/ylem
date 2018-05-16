## Getting Started with NPM and Webpack

The best way to get **ylem** started with Webpack and React is with [Create React App](https://github.com/facebook/create-react-app).

```sh
npx create-react-app my-app
cd my-app
npm start
```

From here, you can modify `src/App.js` to use ylem and see the live-reload in the browser.

```js
import React from 'react';
import logo from './logo.svg';
import './App.css';
import ylem from 'ylem';

class App extends ylem.Component {
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

Next: [Observable State](./use-observable-state.md)
