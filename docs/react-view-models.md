@module {Object} react-view-models
@parent can-ecosystem
@group react-view-models.exports methods
@description Connect View-Models, which are CanJS observables, to React Components
@package ../package.json

@type {Object}

`react-view-models` is a library to connect observable view-models to [React](https://facebook.github.io/react/) [presentational components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8) to create auto rendering [container components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8).

- The [react-view-models.connect connect] method takes a [DefineMap](./can-define/map/map.html) class and a React component class, and returns a new React Component which will autorender when obsevable changes happen on the view model

@body

React-View-Models follows the pattern popularized by [react-redux](https://github.com/reactjs/react-redux), and provide users with a [react-view-models.connect connect] function for extending [React](https://facebook.github.io/react/) Presentational Components into Container Components, by providing `connect` with either a `mapToProps` function or more commonly a `ViewModel` constructor function, which is an extended [DefineMap](./can-define/map/map.html) class, along with a presentational component, just like react-redux does.

The `ViewModel` is an observable, and when any observable change happens to one of it's properties, or if new props get set on the Container Component, it will be serialized and sent into the connected component as props, forcing an update/render.

The `mapToProps` function will get converted to a compute, so when any observable read inside the compute emits a change (or if new props get set on the Container Component), it will update the wrapped/connected presentational component instance with new derived props.

By following the patterns established by react-redux, but avoiding the complexity of pure-functional programing, reducer composition, immutability, and the single store paradigm, we hope to offer a familiar, powerful, but far simpler solution to creating great backing data stores for your react app.

## Use

`save-button.js`

```javascript
var connect = require('react-view-models').connect;
var Button = require('./button.jsx');
var DefineMap = require('can-define/map/');
var Item = require('../models/items');

var items = Items.getList({ selected: true });

var ViewModel = DefineMap.extend({
  text: {
    get() {
      return `Save ${items.length} items`;
    }
  },
  onClick() {
    items.saveAllItems();
  }
});

module.exports = connect( ViewModel, Button );
```

Every instance of the returned **container component** will generate an instance of the `viewModel` and provide `props` to the connected component based on the serialized `viewModel` instance.

The **ViewModel** instance will be initialized with the `props` passed into the Container Component. Whenever the container component will receive new `props`, the `props` object is passed to the viewModels `.set()` method, which may in turn cause an observable change event, which will re-run the serialization process and provide the connected component new props, which in turn may cause a new render.

Methods on the view model, and copied onto the serialized props object and bound to the viewModel, so that they may be used as callbacks for the connected component, while still being called with the correct context.

#### Example:

```javascript
var connect = require('react-view-models').connect;
var DefineMap = require('can-define/map/');
var TodoComponent = require('components/todo.jsx');
var Todo = require('models/todo');

var ViewModel = DefineMap.extend({
  showOnlyCompleted: 'boolean',
  todos: {
    value: Todo.getList( { completed: this.showOnlyCompleted } ),
    serialize: true
  },
  addTodo(formValues) {
    new Todo(formValues).save()
  }
});

module.exports = connect( ViewModel, TodoComponent );
```

The **mapToProps** function has one parameter, `ownProps`, which are the props that would have normally been passed into this component instance, as defined by the owner template (JSX).

The return value of the **mapToProps** function will be an object, mapping the values to be used as props to the Presentational Components instance, and will be merged into the props the component would already be receiving from it's owner in the template it is used in (MapToProps values will overwrite the props passed in through the template). Since React components should not really be expecting observables, it may be appropriate (though not required) to serialize any observables in the mapToProps function (using `attr`, `serialize`, `.map` and `.reduce` ) when computing the value. Expecting observables in your react code will reduce re-usability).

Since the Container Component doesn't produce DOM artifacts of it's own, you won't end up with any wrapper divs or anything to worry about, but in react-device-tools you will see the component with the name `connected( MyComponent )` in the tree. The Container Component holds the "newly computed props" value as its `state`. That state will update whenever the component "receives new props" or the compute emits a "change" event, which will then pass props down into the connected component instance, possibly causing some parts to re-render.

Any user actions that should affect the state should be handled with callbacks on props (like `onClick` or `onSelectNewCountry`), and should be implemented in the MapToProps function as methods on the return value. The callback methods can be used to directly act on the observables.

#### Example:

```javascript
var connect = require('react-view-models').connect;
var Todo = require('../models/todo');
var CheckList = require('./checklist.jsx');

module.exports = connect( ownProps => {
  return {
    todos: Todo.getList( { completed: ownProps.showOnlyCompleted } ),
    addTodo(formValues) {
      new Todo(formValues).save()
    }
  };
}, CheckList ) ;
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

### Not passing through all props to the child component by default

By default, any props passed into the connected component will be passed down into the child component, unless otherwise tampered with. You control which props get passed down by setting a serialize param on each property, a using the `'*'` key to set the default to false.

```javascript
const ViewModel = DefineMap.extend({
  '*': {
    serialize: false
  },
  somePropToBePassedThrough: {
    type: 'any',
    serialize: true
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
    },
    serialize: true
  }
});
```

> _This can be one of the tricker conceits of the current API, suggestions are welcome._
