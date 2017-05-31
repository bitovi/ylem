@function react-view-models.Component Component
@parent react-view-models 0
@description Connect a [can-define/map/map] constructor function to a React component to create an auto-rendering component with an observable view-model.

@signature `class App extends Component`

Create an auto-rendering [container component](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8) by connecting an observable view-model to a React [presentational component](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8).

```javascript
import { Component } from 'react-view-models';

export default class AppComponent extends Component {
  ...
}

AppComponent.ViewModel = DefineMap.extend({
  ...
});
```

The `ViewModel` is an observable, and when any observable change happens to one of its properties, or if new props get set on the container component, some of the view-model’s properties will be sent into the connected component as props, forcing an update/render.

_Note: If you extend any of the [React lifecycle methods](https://facebook.github.io/react/docs/react-component.html#the-component-lifecycle), you must call `super` so as not to break the view-model binding. This includes: `componentWillReceiveProps`, `componentWillMount`, `componentDidMount`, `componentWillUpdate`, `componentDidUpdate`, and `componentWillUnmount`._

@property {can-define/map/map} ViewModel A [can-define/map/map] constructor function


@body

## Use

```jsx
import React from 'react';
import { Component } from 'react-view-models';
import DefineMap from 'can-define/map/map';

export default class AppComponent extends Component {
  render() {
    return <div>{this.props.name}</div>;
  }
}

AppComponent.ViewModel = DefineMap.extend('AppVM', {
  first: {
    type: 'string',
    value: 'Christopher'
  },
  last: {
    type: 'string',
    value: 'Baker'
  },
  name: {
    get() {
      return this.first + ' ' + this.last;
    },
  },
});
```

Every instance of the returned component will generate an instance of the ViewModel and provide it as props to the connected component. The `ViewModel` instance will be initialized with the `props` passed into the container component, and provided to your methods as `this.props`. Whenever the container component receives new `props`, the new values are passed to the viewModel’s `.set()` method, which may in turn cause an observable change event, which will re-run the observed render process and provide the child component new props, which may cause a new render.
