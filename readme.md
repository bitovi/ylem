# React View-Models

[![Build Status](https://travis-ci.org/canjs/react-view-models.png?branch=master)](https://travis-ci.org/canjs/react-view-models)
[![Greenkeeper badge](https://badges.greenkeeper.io/canjs/react-view-models.svg)](https://greenkeeper.io/)

Connect observable view-models to React [presentational components][1] to create auto rendering [container components][1].

## Install

### ES6

```js
import reactViewModel from 'react-view-models';
import { Component } from 'react-view-models';
import { makeReactComponent } from 'react-view-models';
```

### CommonJS

```js
var reactViewModel = require('react-view-models');
var Component = require('react-view-models').Component;
var makeReactComponent = require('react-view-models').makeReactComponent;
```

## API

### `reactViewModel( displayName, ViewModel, Component )`
Connect a ViewModel class to React [presentational components][1] and produce a renderer function (primarily for use in `CanComponent.extend()`).

`reactViewModel()` takes 3 arguments. The first (optional) is the displayName of the resulting ReactComponent (only used for render functions). The second is a **ViewModel** constructor function, which is an extended [can-define/map][2]. The third argument is a **Presentational Component** constructor function or render function. If `Component` is a render function, a new React Component will be created, extending `CanReactComponent`, which uses the provided render function. The `reactViewModel()` function returns a renderer function, which can be used by `CanComponent.extend()` or manually to create a DOM Fragment.

Since the **Container Component** doesn't produce DOM artifacts of it’s own, you won’t end up with any wrapper divs or anything to worry about, but in react-device-tools you will see the component with the `displayName` (or defaults to `CanReactComponentWrapper`) in the tree.

#### Example

```javascript
var React = require('react');
var CanComponent = require('can-component');
var reactViewModel = require('react-view-models');
var stache = require('can-stache');

var ViewModel = DefineMap.extend('AppVM', {
  first: {
    type: 'string',
    value: 'foo'
  },
  last: {
    type: 'string',
    value: 'bar'
  },
  text: {
    get() {
      return this.first + this.last;
    },
  },
});

module.exports = CanComponent.extend({
  tag: 'app-component',
  ViewModel: ViewModel,
  view: reactViewModel('AppComponent', ViewModel, (props) => {
    return (
      <div>{props.text}</div>
    );
  })
});
```

### `Component` class
Connect a ViewModel class to React [presentational components][1]

To use the `Component` class, your **Presentational Component** should extend `Component` instead of `React.Component`, and you should provide a static `ViewModel` on your class.

Every instance of the returned component will generate an instance of the ViewModel and provide it as props to the connected component. The `ViewModel` instance will be initialized with the `props` passed into the Container Component, and provided to your methods as `this.props`. Whenever the container component will receive new `props`, the new values are passed to the viewModels `.set()` method, which may in turn cause an observable change event, which will re-run the observed render process and provide the child component new props, which may cause a new render.

_note: If you extend any of the react lifecycle methods, you must call super so as not to break the view-model binding. This includes: `componentWillReceiveProps`, `componentWillMount`, `componentDidMount`, `componentWillUpdate`, `componentDidUpdate`, `componentWillUnmount`_

#### Example

```javascript
import React from 'react';
import { Component } from 'react-view-models';
import DefineMap from 'can-define/map/';

export default class AppComponent extends Component {
  render() {
    return <div>{this.props.text}</div>;
  }
}

AppComponent.ViewModel = DefineMap.extend('AppVM', {
  first: {
    type: 'string',
    value: 'foo'
  },
  last: {
    type: 'string',
    value: 'bar'
  },
  text: {
    get() {
      return this.first + this.last;
    },
  },
});
```

### `makeReactComponent( displayName, CanComponent )`
Convert a CanComponent class into a React Component.

`makeReactComponent()` takes 2 arguments. The first (optional) is the displayName of the ReactComponent. The second argument is a CanComponent constructor function. The `makeReactComponent()` function returns a React Component which can then be imported and used in any react component or render function as usual.

Since the Component doesn't produce DOM artifacts of it’s own, you won’t end up with any wrapper divs or anything to worry about, but in react-device-tools you will see the component with the `displayName` (or defaults to `CanComponentWrapper`) in the tree.

#### Example

```javascript
import React from 'react';
import CanComponent from 'can-component';
import { makeReactComponent } from 'react-view-models';

const InnerComponent = makeReactComponent(
  CanComponent.extend('InnerComponent', {
    tag: 'inner-component',
    view: stache('<div class="inner">{{text}}</div>')
  })
);

export default class AppComponent extends Component {
  render() {
    return (
      <InnerComponent text="inner text" />
    );
  }
}
```

## Common use cases when using a view model
Here are some examples that may come up when using a view-model that may not be obvious at first:

### Transforming a prop before passing it down to a child component

Sometimes you want a prop that is set on your connected component to be set to the exact same prop key on the child component, but modified slightly before passing it down. Here's an example of that:

```javascript
const ViewModel = DefineMap.extend({
  someProp: {
    set( newVal ) {
      return newVal.toUpperCase();
    }
  }
});
```

### Calling a parents callback, while also doing something special in your view models callback
Sometimes, you still want to notify the connected components owner component that the state changed (by calling a callback), but only after or while doing something different within the view-model. In this case, you'll want to define the callback prop as a observable attribute with a getter, rather than a method, and use the `lastSetVal` argument to call the parent components callback.

```javascript
const ViewModel = DefineMap.extend({
  onChange: {
    type: 'function',
    get( lastSetValue ) {
      return (ev) => {
        this.changeTheThing(ev.target);
        if ( lastSetValue ) {
          return lastSetValue(ev);
        }
      };
    }
  }
});
```

## Contributing
[Contributing](./contributing.md)

### Running the tests

Tests can run in the browser by opening a webserver and visiting the `test/test.html` page.
Automated tests that run the tests from the command line in Firefox can be run with

```
npm test
```

## License
[MIT](./LICENSE)

[1]: https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8
[2]: https://canjs.github.io/canjs/doc/can-define/map/map.html
