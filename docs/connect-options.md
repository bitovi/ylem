@typedef {{}} react-view-models.connect.options connect options
@parent react-view-models.connect.types

@description The `options` object is an optional argument passed as the third parameter to connect, that customizes the [container component](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8) returned.

@option {string} displayName

The `displayName` property will be the [container components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8) `displayName` used in [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) as the component name


```js
connect( UserListViewModel, ListComponent, { displayName: 'UserListComponent' } )
```
