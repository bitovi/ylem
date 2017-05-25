@function react-view-models.reactViewModel reactViewModel
@parent react-view-models 0

@description connects a [DefineMap](./can-define/map/map.html) class to a React component to create an auto-rendering component with an observable view-model


@signature `reactViewModel( ViewModel, ReactComponent )`

Creates an auto rendering [container component](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8) by connecting an observable view-model to a React [presentational components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8).

```javascript
export default reactViewModel( ViewModel, AppComponent )
```

@param {can-define/map/map} ViewModel A [DefineMap](./can-define/map/map.html) class / constructor function
@param {ReactComponent} ReactComponent Any React component

@return {Function} A renderer function.


@signature `reactViewModel( displayName, ViewModel, renderFunction )`

Creates an auto rendering [container component](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8) by connecting an observable view-model to a React Render function by first turning it into a React [presentational components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8).

```javascript
export default reactViewModel( 'AppComponent', ViewModel, (props) => (<div></div>) )
```

@param {String} displayName The name of the created [container component](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8)
@param {can-define/map/map} ViewModel A [DefineMap](./can-define/map/map.html) class / constructor function
@param {ReactComponent} ReactComponent Any React component

@return {Function} A renderer function.
