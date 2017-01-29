# React View-Models

### react-view-models

[![Build Status](https://travis-ci.org/BigAB/react-view-models.png?branch=master)](https://travis-ci.org/BigAB/react-view-models)


Connect observable view-models to React [presentational components][1] to create auto rendering [container components][1].

## Install

#### ES6

```js
import { connect } from 'react-view-models';
```

#### CommonJS

```js
var connect = require("react-view-models").connect;
```

## Usage
`save-button.js`
```js
import { connect } from 'react-view-models';
import Button from './button.jsx';
import DefineMap from 'can-define/map/';
import Item from '../models/items';

let items = Items.getList({ selected: true });

const options = {
  properties: {
    text: true,
    onClick: true
  },
  displayName: 'SaveItemsButton'
}

export const ViewModel = DefineMap.extend({
  text: {
    get() {
      return `Save ${items.length} items`;
    }
  },
  onClick() {
    items.saveAllItems();
  }
});

export default connect( ViewModel, Button, options );
```

## API
#### `connect( {ViewModel|mapToProps}, Component, options ) `
Connect a view-model class or mapToProps function to React [presentational components][1]

`connect()` takes 3 arguments. The first is either a **mapToProps** function, a function that will return an object that the component instance will receive as `props`, or a **ViewModel** constructor function, which is an extended [can-define/map][2]. The second argument is a **Presentational Component** constructor function (a.k.a. a class or just component in React). The `connect()` function returns a **Container Component** which can then be imported and used in any react component or render function as usual.

##### ViewModel `{constructor function}`
A [DefineMap][2] constructor function.

Every instance of the returned component will generate an instance of the viewModel and provide props to the connected component based on the `options.properties` object and the viewModel.

The `ViewModel` instance will be initialized with the `props` passed into the Container Component. Whenever the container component will receive new `props`, the `props` object is passed to the viewModels `.set()` method, which may in turn cause an observable change event, which will re-run the observed render process and provide the child component new props, which may cause a new render.

Methods on the view model and specified in the `options.properties` object, will be copied onto the props object and bound to the viewModel, so that they may be used as callbacks for the connected component, while still being called with the correct context.

_note: There is an option to **not** bind the callback to the view-model, by using the special `options.properties` value `nobind`, in case you need an unbound callback._

Since the **Container Component** doesn't produce DOM artifacts of it’s own, you won’t end up with any wrapper divs or anything to worry about, but in react-device-tools you will see the component with the name you pass in `options.displayName` (or defaults to `Connected( MyComponent )`) in the tree. When using a view-model the **Container Component** holds the view-model value as its `state` but will also be available on the component instance as a property `.viewModel`.

#### Example:
```javascript
import { connect } from 'react-view-models';
import DefineMap from 'can-define/map/map';
import TodoComponent from 'components/todo.jsx';
import Todo from 'models/todo';

const options = {
  properties: {
    showOnlyCompleted: true,
    todos: true,
    addTodo: true
  },
  displayName: 'TodoList'
}

const ViewModel = DefineMap.extend({
  showOnlyCompleted: 'boolean',
  todos: {
    value: Todo.getList( { completed: this.showOnlyCompleted } ),
  },
  addTodo(formValues) {
    new Todo(formValues).save()
  }
});

export default connect( ViewModel, TodoComponent, options );
```

##### mapToProps `{function}`
A function that receives props as an argument and returns `props` to be sent to the _connected component_. This `mapTpProps` function will be converted into a [compute][3] and any changes made to _observable_ derived values within this function will re-run this function to calculate the new props and pass them into the connected component.

The **mapToProps** function has one parameter, `ownProps`, which are the props that would have normally been passed into this component instance, as defined by the owner template (JSX).

The return value of the **mapToProps** function will be an object, mapping the values to be used as props to the **Presentational Components** instance. Expecting observables in your react code will reduce re-usability, so any components should treat them as regular objects and lists.

Any user actions that should affect the state should be handled with callbacks on props (like `onClick` or `onSelectNewCountry`), and should be implemented in the MapToProps function as methods on the return value. The callback methods can be used to directly act on the observables.

You do **not** need to supply the `options.properties` object when using a `mapToProps` function, and in fact it will be ignored if you do.

#### Example:
```javascript
import Todo from 'models/todo';

connect( ownProps => {
  return {
    todos: Todo.getList( { completed: ownProps.showOnlyCompleted } ),
    addTodo(formValues) {
      new Todo(formValues).save()
    }
  };
}, MyComponent ) ;
```

##### Component `{react component}`
Any react component, usually a [presentational component][1]

## Common use cases when using a view model
Here are some examples that may come up when using a view-model that may not be obvious at first:

#### Transforming a prop before passing it down to a child component

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

#### passing through props to the child component
By default, any props passed into the connected component will be set on your view-model. You control which props get passed down into the child component using the `options.properties` object, and they will pass nothing by default.

You can also use a *special spread key* in the `options.properties` object, which will spread any properties passed to the connected component, onto the child component by default. Of course any view-model properties specified in `options.properties` will override the spread props.

```javascript
const options = {
  properties: {
    '...': true,
    'notToBePassedDown': false,
    'upperCasedBeforePassingThrough': true
  }
}

const ViewModel = DefineMap.extend({
  set upperCasedBeforePassingThrough(value) {
    return value.toUpperCase();
  }
});

export default connect( ViewModel, MyComponent, options )
```

#### Calling a parents callback, while also doing something special in your view models callback
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
> _This can be one of the tricker conceits of the current API, suggestions are welcome._

## Contributing
[Contributing](./contributing.md)


### Running the tests

Tests can run in the browser by opening a webserver and visiting the `test/test.html` page.
Automated tests that run the tests from the command line in Firefox can be run with

```
npm test
```

## Why React-View-Models?

React-View-Models follows the pattern popularized by [react-redux][4], and provide users with a `connect()` function for extending React Presentational Components into Container Components, by providing `connect` with either a `mapToProps` function or more commonly a `ViewModel`  constructor function, which is an extended [DefineMap][2] class, along with a presentational component, just like react-redux does.

The `ViewModel` is an observable, and when any observable change happens to one of it's properties, or if new props get set on the Container Component, some of the view-models properties will be sent into the connected component as props, forcing an update/render.

The `mapToProps` function will get converted to a compute, so when any observable read inside the compute emits a change (or if new props get set on the Container Component), it will update the wrapped/connected presentational component instance with new derived props.

By following the patterns established by react-redux, but avoiding the complexity of pure-functional programing, reducer composition, immutability, and the single store paradigm, we hope to offer a familiar, powerful, but far simpler solution to creating great state management and data stores for your react app.

## License
[MIT](./LICENSE)

[1]: https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8
[2]: https://canjs.github.io/canjs/doc/can-define/map/map.html
[3]: https://canjs.github.io/canjs/doc/can-compute.html
[4]: https://github.com/reactjs/react-redux
