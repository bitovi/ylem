@module {Object} react-view-models
@parent can-ecosystem
@description Connect View-Models, which are CanJS observables, to React Components
@package ../package.json

@type {Object}

`react-view-models` is a library to connect observable view-models to [React](https://facebook.github.io/react/) [presentational components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8) to create auto rendering [container components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8).

- The [react-view-models.connect connect] method takes a [DefineMap](./can-define/map/map.html) class and a React component class, and returns a new React Component which will auto-render when observable changes happen on the view-model

@body

React-View-Models follows the pattern popularized by [react-redux](https://github.com/reactjs/react-redux), and provide users with a [react-view-models.component CanReactComponent] function for extending [React](https://facebook.github.io/react/) Presentational Components into Container Components, by providing a `ViewModel` constructor function, which is an extended [DefineMap](./can-define/map/map.html).

The `ViewModel` is an observable, and when any observable change happens to one of it's properties, or if new props get set on the Container Component, some of the view-model's properties will be sent into the connected component as props, forcing an update/render.

By following the patterns established by react-redux, but avoiding the complexity of pure-functional programing, reducer composition, immutability, and the single store paradigm, we hope to offer a familiar, powerful, but far simpler solution to creating great state management and data stores for your react app.

_note: If you extend any of the react lifecycle methods, you must call super so as not to break the view-model binding. This includes: `componentWillReceiveProps`, `componentWillMount`, `componentDidMount`, `componentWillUpdate`, `componentDidUpdate`, `componentWillUnmount`_

## Use

```javascript
import CanReactComponent from 'react-view-models';
import DefineMap from 'can-define/map/';

export default class AppComponent extends CanReactComponent {
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

Every instance of the returned **container component** will generate an instance of `ViewModel` and provide it as `props` to the connected component.

The **ViewModel** instance will be initialized with the `props` passed into the Container Component. Whenever the container component will receive new `props`, the `props` object is passed to the viewModels `.set()` method, which may in turn cause an observable change event, which will re-run the observed render process and provide the child component new props, which may cause a new render.

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
