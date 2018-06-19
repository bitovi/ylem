# ylem
### State Management for React: Effortless, Expandable, Adaptable

[![Build Status](https://travis-ci.org/bitovi/ylem.svg?branch=master)](https://travis-ci.org/bitovi/ylem)
[![Greenkeeper Badge](https://badges.greenkeeper.io/bitovi/ylem.svg)](https://greenkeeper.io/)

**ylem** provides scalable and easy to understand state management for your [React](https://reactjs.org) application. It works by enhancing **Dumb** ([presentational](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8)) components into **Smart** ([container](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8)) components by "connecting" them to [observable objects and arrays](./docs/api.md#observable-objects).

If you are familiar with Redux, **ylem** will feel very familiar.

When your state updates, your components automatically re-render, allowing you to separate your UI from your Business Logic in a way that is familiar, easy to test, and just makes sense.

```js
import React, { Component } from "react";
import ReactDOM from "react-dom";
import ylem, { ObserveObject } from "ylem";

class Store extends ObserveObject {
  count = 0

  increment = () => {
    this.count++;
  }

  decrement = () => {
    this.count--;
  }
}

class MyComponent extends Component {
    render() {
      const { count, increment, decrement } = props;
      return (
          <div>
            <button onClick={decrement}>-</button>
            <input readOnly value={count} />
            <button onClick={increment}>+</button>
          </div>
      )
    }
}

const App =  ylem(Store, MyComponent);

ReactDOM.render(<App />, document.getElementById("root"));
```

---

Learn how to architect your React app with **ylem** for concise and powerful state management without the struggle.

- [Get Started](#getting-started)
- [API](./docs/api.md)
- [Advanced Topics](./docs/advanced-topics.md)
- [Examples](./docs/examples.md)

## Getting Started

_This small getting started guide is just to get you familiar with the concepts around **ylem**. For more specific information checkout out [API docs](./docs/api.md) and for more information and different ways to use **ylem** checkout out the [Advanced Topics](./docs/advanced-topics.md)._

### Step 1
#### Start by setting up a new app with [create-react-app](https://github.com/facebook/create-react-app)

If you need information for how to set up a new project with create-react-app we've provided a quick guide:
* [Start locally with create-react-app](./docs/getting-started-create-react-app.md)
* [Just jump right in with CodeSandbox](https://codesandbox.io/s/j311ryqpy?module=%2Fsrc%2FApp.js)

_Alternatively, if you want to start a new project using [StealJS](https://stealjs.com/) here is a guide on how to configure Steal for a **ylem** project:_
* [Configure with StealJS](./docs/getting-started-steal.md)

### Step 2
#### Install ylem and modify `App.js`

```sh
npm install ylem
```

Once **ylem** is installed, modify `src/App.js` to match the example below _(copy and paste)_. Feel free to look over what is going on here, but we'll take each part in turn.

```js
import React from "react";
import "./App.css";
import ylem, { ObserveObject } from "ylem";

var store = new ObserveObject({
  count: 0,
  increment() {
    this.count++;
  }
});

export default ylem(() => (
  <div>
    <input readOnly value={store.count} />
    <button onClick={store.increment}>+</button>
  </div>
));
```

### Step 3
#### Understanding ylems Observable Objects

**ylem** exports some classes `ObserveObject` and `ObserveArray`. From these classes you can construct **observable instances**, which will inform **ylems** "observers" whenever a property is changed or mutated on the instance. This is the basis for our reactive stores.

```js
var store = new ObserveObject({
  count: 0,
  increment() {
    this.count++;
  }
});

export default ylem(() => (
  <div>
    <input readOnly value={store.count} />
    <button onClick={store.increment}>+</button>
  </div>
));

```

You can **extend** `ObserveObject` to create **your own** class of observable instances. This way you can create objects that represent the state of your component along with methods to mutate that state.

Change your `App.js` code to something like this:

```js
class Store extends ObserveObject {
  count = 0

  increment = () => {
    this.count++;
  }
}

const store = new Store();

export default ylem(() => (
  <div>
    <input readOnly value={store.count} />
    <button onClick={store.increment}>+</button>
  </div>
));
```

**But you don't write React components like this!** You create reusable bits of user interface by creating React components that take props and call callbacks passed in as props.

In the next step we'll create a regular old React component and use **ylem** to "connect" it to the observable store.

### Step 4
#### Connect your Store to your Component

Similar to Redux, **ylem** is all about connecting data stores to "Dumb" (presentation) components to create "Smart" (container) components.

Once connected, **ylem** will automatically pass an instance of the `Store` class to your component as props:

```js
class Store extends ObserveObject {
  count = 0

  increment = () => {
    this.count++;
  }
}

const Counter = props => (
  // props is an instance of your Store class
  <div>
    <input readOnly value={props.count} />
    <button onClick={props.increment}>+</button>
  </div>
);

// Use ylem to connect your Store to your Component
export default ylem(Store, Counter);
```

Though we used a "function component" for `Counter` in that example, we could have used **any** React component at all, even components with their own state. **ylem** uses the [Higher-Order Component](https://reactjs.org/docs/higher-order-components.html) pattern to create a new component that wraps the provided component in an "observer component" and passes the observable object instance as props.

##### **ylem** let's you enhance the components you already have.

The components passed to `ylem` are just React components, so it will work with any React component library or the components you've already developed.

This encourages generic, reusable UI Components, that are connected to app specific behavior and state provided by `ylem` observable objects and arrays.

### Step 5
#### Connect your Store to other Stores

The real power of of **ylems** Observable Objects is in the fact that you can connect Observable Objects by deriving values from other Observable Objects. Since they are all reactive, any change in one will trigger a change in the other, which may ultimately end up in a a component re-render.

Using class accessor _getters_ (`get`), Observable Objects will rely on each others properties, and using that, we can organize our Stores into "Domain Models", or concepts that make sense to the app we are building.

Let's start by creating a new file called `appstate.js`.

This `appstate` will be an observable object instance, representing our top level store for the whole app.

```js
// appstate.js
import { ObserveObject } from "ylem";
class AppState extends ObserveObject {
  user = null

  login = () => {
    this.user = "yetti";
  }
}

export default new AppState();
```

Authentication in a real app is much more complicated than what we show here. This example is to demonstrate how it works without getting to deep into the weeds.

Now, back in our `App.js` component, let's import the `appstate` instance and use the `user` property and `login` method to show how you can split your stores into independent entities, but still keep the reactive nature for your auto-rendering UI components.

```js
import React from "react";
import "./App.css";
import ylem, { ObserveObject } from "ylem";
import appstate from "./appstate";

class Store extends ObserveObject {
  count = 0

  increment = () => {
    this.count++;
  }

  get user() {
    return appstate.user;
  }

  login() {
    appstate.login();
  }
}

const Counter = ({ user, login, count, increment }) => (
  <div>
    {user ? (
      <div>Welcome {user.name}!</div>
    ) : (
      <button onClick={login}>Login</button>
    )}
    <hr />
    <input readOnly value={count} />
    <button onClick={increment}>+</button>
  </div>
);

export default ylem(Store, Counter);
```
## Continue learning about ylem...

I hope you can see the value of what we've shown in this contrived example, but **ylem** offers even more:

- `connect()` a Redux like syntax
- `createComponent()` for turning observable objects into React component that take a render prop
- decorators for enhancing your observable classes with async and realtime behaviors and other goodies
- and more...

Check out the [Advanced Topics](./docs/advanced-topics.md) and [Examples](./docs/examples.md) to see more of what **ylem** can do.

## Contributing
Read the [contributing guides](../contributing.md)

## License
[MIT](../LICENSE.md) License
