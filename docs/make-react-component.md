@function react-view-models.makeReactComponent makeReactComponent
@parent react-view-models 2

@description Creates a React Component out of a [can-component].


@signature `makeReactComponent( displayName, CanComponent )`

Convert a [can-component] into a React Component.

`makeReactComponent()` takes 2 arguments. The first (optional) is the displayName of the ReactComponent. The second argument is a CanComponent constructor function. The `makeReactComponent()` function returns a React Component which can then be imported and used in any react component or render function as usual.

Since the Component doesn’t produce DOM artifacts of its own, you won’t end up with any wrapper divs or anything to worry about, but in react-device-tools you will see the component with the `displayName` (or defaults to `CanComponentWrapper`) in the tree.

```javascript
export default makeReactComponent( 'AppComponent', CanComponent.extend({ ... }) )
```

@param {String} displayName The name of the created component
@param {CanComponent} CanComponent Any Can component

@return {ReactComponent} A React component


@body

## Use

```jsx
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
