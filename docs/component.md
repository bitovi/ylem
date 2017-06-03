@function react-view-model/component react-view-model/component
@parent can-ecosystem
@group react-view-model/component.static 0 static

@description Create an auto-rendering container component with an observable view-model.

@signature `class App extends Component`

Create an auto-rendering [container component](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8) by connecting an observable [can-define/map/map] view-model to a React [presentational component](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8).

```javascript
import { Component } from 'react-view-model';

export default class AppComponent extends Component {
  ...
}

AppComponent.ViewModel = DefineMap.extend({
  ...
});
```

Every instance of the component will generate an instance of the ViewModel, initialized with the props, and provide it as `this.viewModel`. Whenever the container component receives new props, the new values are passed to the viewModel’s `.set()` method, which may in turn cause an observable change event, which will re-run the observed render process.

_Note: If you extend any of the [React lifecycle methods](https://facebook.github.io/react/docs/react-component.html#the-component-lifecycle), you must call `super` so as not to break the view-model binding. This includes: `componentWillReceiveProps`, `componentWillMount`, `componentDidMount`, `componentWillUpdate`, `componentDidUpdate`, and `componentWillUnmount`._


@body

## Use

An example application using the ViewModel to create an extra prop, who's value is derived from other props.

```jsx
import React from 'react';
import { Component } from 'react-view-model';
import DefineMap from 'can-define/map/map';

export default class AppComponent extends Component {
  static ViewModel = DefineMap.extend('AppVM', {
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

  render() {
    return <div>{this.viewModel.name}</div>;
  }
}
```

An example application which includes viewModel mutation and demonstrates auto-rendering.

```jsx
import React from 'react';
import { Component } from 'react-view-model';
import DefineMap from 'can-define/map/map';

export default class AppComponent extends Component {
  static ViewModel = DefineMap.extend('AppVM', {
    count: {
      type: 'number',
	  value: 0
    },
    increment: function() {
      return this.count++;
    },
  });

  render() {
    return <div>{this.viewModel.name}</div>;
  }
}
```
