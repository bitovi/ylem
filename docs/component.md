@function react-view-models.Component Component
@parent react-view-models 1

@description Connects a [DefineMap](./can-define/map/map.html) class to a React component to create an auto-rendering component with an observable view-model.


@signature `class App extends Component`

Creates an auto-rendering [container component](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8) by connecting an observable view-model to React [presentational components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8):

```javascript
import { Component } from 'react-view-models';

export default class AppComponent extends Component {
  ...
}

AppComponent.ViewModel = DefineMap.extend({
  ...
});
```

_Note: If you extend any of the [React lifecycle methods](https://facebook.github.io/react/docs/react-component.html#the-component-lifecycle), you must call `super` so as not to break the view-model binding. This includes: `componentWillReceiveProps`, `componentWillMount`, `componentDidMount`, `componentWillUpdate`, `componentDidUpdate`, and `componentWillUnmount`._

@param {can-define/map/map} ViewModel A [DefineMap](./can-define/map/map.html) class / constructor function


@body

## Use

```jsx
import React from 'react';
import { Component } from 'react-view-models';
import DefineMap from 'can-define/map/map';

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

Every instance of the returned component will generate an instance of the ViewModel and provide it as props to the connected component. The `ViewModel` instance will be initialized with the `props` passed into the Container Component, and provided to your methods as `this.props`. Whenever the container component receives new `props`, the new values are passed to the viewModel’s `.set()` method, which may in turn cause an observable change event, which will re-run the observed render process and provide the child component new props, which may cause a new render.
