# React-View-Model

[![Build Status](https://travis-ci.org/canjs/react-view-model.png?branch=master)](https://travis-ci.org/canjs/react-view-model)
[![Greenkeeper badge](https://badges.greenkeeper.io/canjs/react-view-model.svg)](https://greenkeeper.io/)

Connect observable view-model to React [presentational components][1] to create auto rendering [container components][1].

## Install

### ES6

```js
import reactViewModel from 'react-view-model';
import { Component } from 'react-view-model';
import { makeReactComponent } from 'react-view-model';
```

### CommonJS

```js
var reactViewModel = require('react-view-model');
var Component = require('react-view-model').Component;
var makeReactComponent = require('react-view-model').makeReactComponent;
```

## Common use cases when using a view model

Here are some examples that may come up when using a view-model that may not be obvious at first:

### Transforming a prop before passing it down to a child component

Sometimes you want a prop that is set on your connected component to be set to the exact same prop key on the child component, but modified slightly before passing it down. Here’s an example of that:

```javascript
const ViewModel = DefineMap.extend({
  someProp: {
    set( newVal ) {
      return newVal.toUpperCase();
    }
  }
});
```

### Calling a parent’s callback while also doing something special in your view-model’s callback

Sometimes you still want to notify the connected component’s owner component that the state changed (by calling a callback), but only after or while doing something different within the view-model. In this case, you’ll want to define the callback prop as a observable attribute with a getter, rather than a method, and use the `lastSetVal` argument to call the parent component’s callback.

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
