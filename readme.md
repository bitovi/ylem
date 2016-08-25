# Can-React

### @bigab/can-react

[![Build Status](https://travis-ci.org/BigAB/can-react.png?branch=master)](https://travis-ci.org/BigAB/can-react)


Connect observable view-models to React [presentational components][1] to create auto rendering [container components][1].

## Install

#### ES6

```js
import { connect } from '@bigab/can-react';
```

#### CommonJS

```js
var connect = require("@bigab/can-react").connect;
```

## Usage
`save-button.js`
```js
import { connect } from '@bigab/can-react';
import Button from './button.jsx';
import DefineMap from 'can-define/map/';
import Item from '../models/items';

let items = Items.getList({ selected: true });

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

export default connect( ViewModel, Button );
```

## API
#### `connect( {ViewModel|mapToProps}, Component ) `
Connect a view-model class or mapToPros function to React [presentational components][1]

`connect()` takes 2 arguments. The first is either a **mapToProps** function, a function that will return an object that the component instance will receive as `props`, or a **ViewModel** constructor function, which is an extended [can-define/map][2]. The second argument is a **Presentational Component** constructor function (a.k.a. a class or just component in React). The `connect()` function returns a **Container Component** which can then be imported and used in any react component or render function as usual.

##### ViewModel `{constructor function}`
A [DefineMap][2] constructor function.

Every instance of the returned component will generate an instance of the viewModel and provide props to the connected component based on the serialized Map instance.

The `ViewModel` instance will be initialized with the `props` passed into the Container Component. Whenever the container component will receive new `props`, the `props` object is passed to the viewModels `.set()` method, which may in turn cause an observable change event, which will re-run the serialization process and provide the connected component new props, which may cause a new render.

Methods on the view model, and copied onto the serialized props object and bound to the viewModel, so that they may be used as callbacks for the connected component, while still being called with the correct context.

#### Example:
```javascript
import { connect } from '@bigab/can-react';
import DefineMap from 'can-define/map/map';
import TodoComponent from 'components/todo.jsx';
import Todo from 'models/todo';

const ViewModel = DefineMap.extend({
  showOnlyCompleted: 'boolean',
  todos: {
    value: Todo.getList( { completed: this.showOnlyCompleted } ),
    serialize: true
  }
  addTodo(formValues) {
    new Todo(formValues).save()
  }
});

export default connect( ViewModel, TodoComponent );
```

##### mapToProps `{function}`
A function that receives props as an argument and returns `props` to be sent to the _connected component_. This `mapTpProps` function will be converted into a [compute][3] and any changes made to _observable_ derived values within this function will re-run this function to calculate the new props and pass them into the connected component.

The **mapToProps** function has one parameter, `ownProps`, which are the props that would have normally been passed into this component instance, as defined by the owner template (JSX).

The return value of the **mapToProps** function will be an object, mapping the values to be used as props to the Presentational Components instance, and will be merged into the props the component would already be receiving from it’s owner in the template it is used in (MapToProps values will overwrite the props passed in through the template). Since React components should not really be expecting observables, it may be appropriate (though not required) to serialize any observables in the mapToProps function (using `attr`, `serialize`, `.map` and `.reduce` ) when computing the value. Expecting observables in your react code will reduce re-usability).

Since the Container Component doesn't produce DOM artifacts of it’s own, you won’t end up with any wrapper divs or anything to worry about, but in react-device-tools you will see the component with the name `connected( MyComponent )` in the tree. The Container Component holds the “newly computed props” value as its `state`. That state will update whenever the component “receives new props” or the compute emits a “change” event, which will then pass props down into the connected component instance, possibly causing some parts to re-render.

Any user actions that should affect the state should be handled with callbacks on props (like `onClick` or `onSelectNewCountry`), and should be implemented in the MapToProps function as methods on the return value. The callback methods can be used to directly act on the observables.

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

## Contributing
[Contributing](./contributing.md)


### Running the tests

Tests can run in the browser by opening a webserver and visiting the `src/test/test.html` page.
Automated tests that run the tests from the command line in Firefox can be run with

```
npm test
```

## Why Can-React?

Can-React follows the pattern popularized by [react-redux][4], and provide users with a `connect()` function for extending React Presentational Components into Container Components, by providing `connect` with either a `mapToProps` function or more commonly a `ViewModel`  constructor function, which is an extended [DefineMap][2] class, along with a presentational component, just like react-redux does.

The `ViewModel` is an observable, and when any observable change happens to one of it's properties, or if new props get set on the Container Component, it will be serialized and sent into the connected component as props, forcing an update/render.

The `mapToProps` function will get converted to a compute, so when any observable read inside the compute emits a change (or if new props get set on the Container Component), it will update the wrapped/connected presentational component instance with new derived props.

By following the patterns established by react-redux, but avoiding the complexity of pure-functional programing, reducer composition, immutability, and the single store paradigm, we hope to offer a familiar, powerful, but far simpler solution to creating great backing data stores for your react app.

## License
[MIT](./LICENSE)

[1]: https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8
[2]: https://canjs.github.io/canjs/doc/can-define/map/map.html
[3]: https://canjs.github.io/canjs/doc/can-compute.html
[4]: https://github.com/reactjs/react-redux
