@function react-view-model react-view-model
@parent can-views
@collection can-ecosystem
@description Create an auto-rendering container component with an observable view-model by providing a ViewModel and a React render function.
@package ../package.json

@signature `reactViewModel( [displayName], [ViewModel], renderFunction )`

Create an auto-rendering [container component](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8) by connecting an observable view-model to a React [presentational render function](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8).

Every instance of the component will generate an instance of the ViewModel, initialized with the props, and provide it to the render function. Whenever the container component receives new props or a value on the viewModel changes, it will trigger an update.

If `displayName` is omitted, it will default based on the `renderFunction`'s name, or "ReactVMComponentWrapper." This is really only significant when debugging.

If `ViewModel` is omitted, it will default to [can-define/map/map]. This will still provide the benefits of auto-rendering, though you cannot add smart properties like you can with a custom `ViewModel`.

```jsx
export default reactViewModel( 'AppComponent', ViewModel, (viewModel) => (<div>{viewModel.name}</div>) );
```

@param {String} displayName The name of the created [container component](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8) (optional)
@param {can-define/map/map} ViewModel A [can-define/map/map] constructor function (optional)
@param {Function} renderFunction A React render function

@return {ReactComponent} An auto-rendering React Component

@body

## Use

An example application using the ViewModel to create an extra prop, whose value is derived from other props.

@demo demos/react-view-model/function.name.html

An example application which includes viewModel mutation and demonstrates auto-rendering.

@demo demos/react-view-model/function.counter.html

You can also play with the above example on JS Bin:

<a class="jsbin-embed" href="https://jsbin.com/cudobut/2/embed?js,output">react-view-model demo on jsbin.com</a>

You can also use this module with [Preact](https://preactjs.com):

<a class="jsbin-embed" href="https://jsbin.com/muqeqec/5/embed?js,output">react-view-model demo with Preact on jsbin.com</a>

<script src="https://static.jsbin.com/js/embed.min.js?4.0.4"></script>
