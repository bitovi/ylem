# ylem - Easy state management for React

[![Build Status](https://travis-ci.org/bitovi/ylem.svg?branch=master)](https://travis-ci.org/bitovi/ylem)
[![Greenkeeper Badge](https://badges.greenkeeper.io/bitovi/ylem.svg)](https://greenkeeper.io/)

**ylem** provides fast and easy state management for your [React](https://reactjs.org) application by using [observable objects](https://canjs.com/doc/can-observe.html). Simply update your state objects whenever/however you want and your app will be re-rendered as efficiently as possible.

## Getting Started

```
npm install ylem --save
```

* [Configure with Webpack](./docs/getting-started-webpack.md)
* [Configure with StealJS](./docs/getting-started-steal.md)

## Usage

### Step 1 - Create observable stores using ObserveObject

The recommended way for creating observable stores is to create a class which extends `ObserveObject`:

```js
// Store.js
import { ObserveObject } from 'ylem';

class Store extends ObserveObject {
	count = 0
	
	increment = () => {
	  this.count++;
	}
}

export default Store;
```

### Step 2 - Connect your Store to your Component

Similar to redux, **ylem** is all about connecting data stores to presentation components. Once connected, **ylem** will automatically pass an instance of the store to your component as props:

```js
// Counter.js
import React from 'react';
import ylem from 'ylem';
import Store from './store';

const Counter = (props) => (
   // props is an instance of your Store class
	<div onClick={props.increment}>{props.count}</div>
);

// Use ylem to connect your Store to your Component
export default ylem(Store, Counter);
```

### Step 3 - Render your component!

In the following example, **ylem** will render the Counter component with a starting count of `99`:

```js
import React, Component from 'react';
import { ObserveObject } from 'ylem';
import Counter from './counter';

class AppState extends ObserveObject {
  startingCount = 99
};

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Welcome to my Counter app</h1>
        <Counter count={this.props.startingCount} />
      </div>
    );
  }
};

export default ylem(AppState, App)
```

## Contributing
Read the [contributing guides](./contributing.md)

## License
[MIT](./LICENSE.md) License