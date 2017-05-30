@function react-view-models.Component Component
@parent react-view-models 1

@description connects a [DefineMap](./can-define/map/map.html) class to a React component to create an auto-rendering component with an observable view-model


@signature `class App extends Component {}`

Creates an auto rendering [container component](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8) by connecting an observable view-model to a React [presentational components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8)

```javascript
export default class AppComponent extends Component {
	...
}

AppComponent.ViewModel = DefineMap.extend({
	...
});
```

@param {can-define/map/map} ViewModel A [DefineMap](./can-define/map/map.html) class / constructor function
