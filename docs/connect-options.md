@typedef {{}} react-view-models.connect.options connect options
@parent react-view-models.connect.types

@description The `options` object, passed as the third parameter to connect, configures which properties of the view-model will be passed into the child component and customizes the [container component](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8) returned.

@option {Object} properties

The keys of the `properties` object represent the properties of the view-model that will get passed down to the child component, usually a presentational component. The values of the `properties` can be:
 - `true` - meaning yes pass this value down
 - `false` - stop any properties from being passed down
 - `nobind` - stop any view-model methods being passed down from automatically binding its **context** to the view-model
 - `asArray` - to turn array like properties, like DefineLists, into actual arrays before passing into the React component where arrays are more expected and useful than DefineLists

The `nobind` and `asArray` **special values** can be imported as a named import from `react-view-models`.

```js
import connect, { asArray, nobind } from 'react-view-models';

const options = {
  properties: {
    'list': asArray,
    'name': true,
    'onClick': nobind,
    'onUserSelect': true
  }
};

export default connect( ViewModel, App, options );
```

There is also a **special spread key** (`...`), which can be put on `properties` and if the value is `true`, any `props` passed into the **Connected Container Component** will also be "spread" onto the child component.

Any view-model `properties` set to true will of course override spread `props` values, and if the property key is set to `false`, it will not be spread onto the child component.

```js
const options = {
  properties: {
    '...': true,
    'notPassedThrough': false,
    'onViewModel': true
  },
  displayName: 'UserListComponent'
}

connect( UserListViewModel, ListComponent, options )
```

@option {string} displayName

The `displayName` property will be the [container components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8) `displayName` used in [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) as the component name


```js
connect( UserListViewModel, ListComponent, { displayName: 'UserListComponent' } )
```

@option {boolean} deepObserve

The `deepObserve` options, is to allow you to observe changes to observables nested within the objects you are passing as props, in case components further down the tree use properties on the nested components and therefore need to be notified if they change.

**There is probably no good reason to use this option and it is very costly performance-wise.**

You would be better off, upgrading the component that is using properties on these nested observables, to a container component with a view-model, then you can use the nested component in your view model, and it will be observable for that component, without having to use the deepObserve option.

This option is here only as a last resort, or to aid in debugging.

```js
const options = {
  properties: {
    'users': true,
    'tickets': true
    'onTicketSubmit': true
  },
  displayName: 'UserTicketExchange',
  deepObserve: true
}

connect( UserListViewModel, ListComponent, options )
```
