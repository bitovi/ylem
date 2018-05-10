@property {function} ylem/component.view-model ViewModel
@parent ylem/component.static

@description Provide a constructor function that provides values and methods to the component. The constructor function is initialized with the props, and updated as the props change.

@option {function} A constructor function usually defined by [can-define/map/map.extend DefineMap.extend] or
[can-map Map.extend] that will be used to create a new observable instance accessible by
the component.

```javascript
import { Component } from 'ylem';

export default class AppComponent extends Component {
  ...
}

AppComponent.ViewModel = DefineMap.extend({
  ...
});
```

@param {Object} props The initial props that are passed to the component.

@return {Object} A new instance of the ViewModel.


@body

## Use

```jsx
import React from 'react';
import { Component } from 'ylem';
import DefineMap from 'can-define/map/map';

export default class AppComponent extends Component {
  render() {
    return <div>{this.viewModel.name}</div>;
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
