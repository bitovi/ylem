@function react-view-model reactViewModel
@parent can-ecosystem
@description Connect a [can-define/map/map] constructor function to a React component to create an auto-rendering component with an observable view-model
@package ../package.json

@signature `reactViewModel( [displayName], [ViewModel], renderFunction )`

Create an auto-rendering [container component](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8) by connecting an observable view-model to a React [presentational render function](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8).

If `displayName` is omitted, it will default based on the `renderFunction`'s name, or "ReactVMComponentWrapper." This is really only significant when debugging.

If `ViewModel` is omitted, it will default to [can-define/map/map]. This will still provide the benefits of auto-rendering, though you cannot add smart properties like you can with a custom `ViewModel`.

```jsx
export default reactViewModel( 'AppComponent', ViewModel, (props) => (<div>{props.name}</div>) );
```

@param {String} displayName The name of the created [container component](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8) (optional)
@param {can-define/map/map} ViewModel A [can-define/map/map] constructor function (optional)
@param {Function} renderFunction A React render function

@return {ReactComponent} An auto-rendering React Component

@body

## Use

```jsx
var React = require('react');
var ReactDOM = require('react-dom');
var reactViewModel = require('react-view-model');

var ViewModel = DefineMap.extend('AppVM', {
  first: {
    type: 'string'
  },
  last: {
    type: 'string'
  },
  name: {
    get() {
      return this.first + ' ' + this.last;
    },
  },
});

var AppComponent = reactViewModel('AppComponent', ViewModel, (props) => {
  return (
    <div>{props.name}</div>
  );
});

var div = document.createElement('div');
document.body.appendChild(div);
ReactDOM.render(<AppComponent first="Christopher" last="Baker" />, div);
// prints: <div>Christopher Baker</div>
```

Every instance of the returned **container component** will generate an instance of `ViewModel` and provide it as `props` to the connected component.

The **ViewModel** instance will be initialized with the `props` passed into the container component. Whenever the container component receives new `props`, the `props` object is passed to the viewModel’s `.set()` method, which may in turn cause an observable change event, which will re-run the observed render process and provide the child component new props, which may cause a new render.
