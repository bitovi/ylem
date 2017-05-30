@page react-view-models react-view-models
@parent can-ecosystem
@description `react-view-models` is a library to connect observable view-models to [React](https://facebook.github.io/react/) [presentational components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8) to create auto rendering [container components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8).
@package ../package.json

@body

## Description

React-View-Models follows the pattern popularized by [react-redux](https://github.com/reactjs/react-redux), and provides users with a [react-view-models.reactViewModel reactViewModel] function for extending [React](https://facebook.github.io/react/) Presentational Components into Container Components, by providing a `ViewModel` constructor function, which is an extended [DefineMap](./can-define/map/map.html).

The `ViewModel` is an observable, and when any observable change happens to one of it's properties, or if new props get set on the Container Component, some of the view-model's properties will be sent into the connected component as props, forcing an update/render.

By following the patterns established by react-redux, but avoiding the complexity of pure-functional programing, reducer composition, immutability, and the single store paradigm, we hope to offer a familiar, powerful, but far simpler solution to creating great state management and data stores for your react app.

_note: If you extend any of the react lifecycle methods, you must call super so as not to break the view-model binding. This includes: `componentWillReceiveProps`, `componentWillMount`, `componentDidMount`, `componentWillUpdate`, `componentDidUpdate`, `componentWillUnmount`_

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
