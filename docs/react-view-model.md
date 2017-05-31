@function react-view-models.reactViewModel reactViewModel
@parent react-view-models 0

@description Connect a [DefineMap](./can-define/map/map.html) constructor function to a React component to create an auto-rendering component with an observable view-model


@signature `reactViewModel( ViewModel, ReactComponent )`

Create an auto-rendering [container component](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8) by connecting an observable view-model to a React [presentational component](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8).

```javascript
export default reactViewModel( ViewModel, AppComponent );
```

@param {can-define/map/map} ViewModel A [DefineMap](./can-define/map/map.html) constructor function
@param {ReactComponent} ReactComponent Any React component

@return {Function} A renderer function.


@signature `reactViewModel( displayName, ViewModel, renderFunction )`

Create an auto-rendering [container component](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8) by connecting an observable view-model to a React Render function by first turning it into a React [presentational component](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8).

```jsx
export default reactViewModel( 'AppComponent', ViewModel, (props) => (<div />) );
```

@param {String} displayName The name of the created [container component](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8)
@param {can-define/map/map} ViewModel A [DefineMap](./can-define/map/map.html) constructor function
@param {ReactComponent} ReactComponent Any React component

@return {Function} A renderer function.


@body

## Use

```jsx
var React = require('react');
var CanComponent = require('can-component');
var reactViewModel = require('react-view-models');
var stache = require('can-stache');

var ViewModel = DefineMap.extend('AppVM', {
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
      return this.first + this.last;
    },
  },
});

module.exports = CanComponent.extend({
  tag: 'app-component',
  ViewModel: ViewModel,
  view: reactViewModel('AppComponent', ViewModel, (props) => {
    return (
      <div>{props.name}</div>
    );
  })
});
```

Every instance of the returned **container component** will generate an instance of `ViewModel` and provide it as `props` to the connected component.

The **ViewModel** instance will be initialized with the `props` passed into the container component. Whenever the container component receives new `props`, the `props` object is passed to the viewModel’s `.set()` method, which may in turn cause an observable change event, which will re-run the observed render process and provide the child component new props, which may cause a new render.
