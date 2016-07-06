### A New Proposal for
# Can-React

### An Explanation:

#### Standing on the shoulders of giants

Redux, is a functional programming style library for managing state in a single store. It uses a pattern of composable pure functions called reducers to represent the state of the app, and uses actions to modify that state and produce updates that a view layer can bind to. React-Redux is a library to connect Redux to the wildly popular library React.

React-Redux has popularized the idea of separating React components into 2 types: Container Components and Presentational Components (previously know as smart components and dumb components). **Presentational Components** are pure react, using props and sometimes state, to decide what to render and when to update the DOM, they are generally highly re-usable and are the favoured choice for components, usually making up the majority of the components in a given app. **Container Components** on the other hand, are “Higher Order Components”, that do not provide their own DOM rendering but rather extend an existing Presentational Component, connecting it to a data store and updating props when the connected state updates.

React-Redux exports a single function `connect()` and a single component `<Provider />` for taking Presentational Components and “upgrading” and extending them into Container Components.

The `connect` function accepts a React Component and some mapping functions, mapping state and action creators to the React `props` the component is expecting to receive. When the stores state is updated the component “receives new props” and re-renders accordingly. When user actions should modify that state, the interaction callbacks provided by props in Presentational Components are mapped to “action creators” which then get sent into the root reducer and fall throughout the reducer tree, and eventually the root reducer returns a new state and the app is re-rendered.

The `<Provider />` component wraps the entire app, and is used to enforce the “single-store” philosophy of react-redux, by providing that store to all the container components.

### Yeah? So…?

Can-React follows the pattern popularized by react-redux, and provide users with a `connect()` function for extending React Presentational Components into Container Components, by providing `connect` with a `mapToProps` function and a presentational component, just like Redux does. The `mapToProps` function will get converted to a compute, so when any observable read inside the compute emits a change, or if new props get set on the Container Component, it will update the wrapped/connected presentational component instance with new derived props.

### Implementation Details

Currently the only API needed, and only one exported in the POC (proof of concept) is a single function called `connect`.

```javascript
connect( mapToProps {function}, Component {React Component} )
```

`connect()` takes 2 arguments. The first is **mapToProps**, a function that will return an object that the component instance will receive as `props`, and the second argument is a **Presentational Component** constructor function (a.k.a. a class or just component in React). The `connect()` function returns a **Container Component** which can then be imported and used in any react component as usual.

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


# @bigab/can-react

[![Build Status](https://travis-ci.org/BigAB/can-react.png?branch=master)](https://travis-ci.org/bigab/can-react)


## Usage

### ES6 use

With StealJS, you can import this module directly in a template that is autorendered:

```js
import plugin from '@bigab/can-react';
```

### CommonJS use

Use `require` to load `@bigab/can-react` and everything else
needed to create a template that uses `@bigab/can-react`:

```js
var plugin = require("@bigab/can-react");
```

## AMD use

Configure the `can` and `jquery` paths and the `@bigab/can-react` package:

```html
<script src="require.js"></script>
<script>
	require.config({
	    paths: {
	        "jquery": "node_modules/jquery/dist/jquery",
	        "can": "node_modules/canjs/dist/amd/can"
	    },
	    packages: [{
		    	name: '@bigab/can-react',
		    	location: 'node_modules/@bigab/can-react/dist/amd',
		    	main: 'lib/bigab-can-react'
	    }]
	});
	require(["main-amd"], function(){});
</script>
```

### Standalone use

Load the `global` version of the plugin:

```html
<script src='./node_modules/@bigab/can-react/dist/global/@bigab/can-react.js'></script>
```

## Contributing

### Making a Build

To make a build of the distributables into `dist/` in the cloned repository run

```
npm install
node build
```

### Running the tests

Tests can run in the browser by opening a webserver and visiting the `test.html` page.
Automated tests that run the tests from the command line in Firefox can be run with

```
npm test
```
