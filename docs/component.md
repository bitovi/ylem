@function react-view-models.component CanReactComponent
@parent react-view-models

@description connects a [DefineMap](./can-define/map/map.html) class to a React component to create an auto-rendering component with an observable view-model

@signature `connect( ViewModel, ReactComponent, options )`

Creates an auto rendering [container component](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8) by connecting an observable view-model to a React [presentational components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8)

```javascript
export default connect( UserListViewModel, ListView, { displayName: 'UserList' } )
```

@param {can-define/map/map} ViewModel A [DefineMap](./can-define/map/map.html) class / constructor function
@param {ReactComponent} ReactComponent Any React component
@param {react-view-models.connect.options} options options object

@return {ReactComponent} A React [container component](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8)

@signature `connect( mapToProps, ReactComponent, options )`

Creates an auto rendering [container component](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8) by connecting a mapToProps function to a React [presentational components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8) as a pseudo-view model. The `mapToProps` function receives one argument, the props of the container component, and will return an object to pass as `props` to the presentational component.

If the container component receives new props, `mapToProps` will run again, and new props will be produced for the presentational component.

The `mapToProps` function will be converted into a [can-compute], so any observable changes within `mapToProps` will cause the mapping to re-run and the container components state to be set, possibly re-rendering the presentational component.

```javascript
const users = Users.getList({ active: true });
export default connect( props => ({ listItems: users }), ListView, { displayName: 'UserListView' })
```

@param {Function} mapToProps A function that has a props argument and returns props
@param {ReactComponent} ReactComponent Any React component
@param {react-view-models.connect.options} options options object

@return {ReactComponent} A React [container component](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8)
