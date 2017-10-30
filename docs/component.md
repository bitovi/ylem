@function react-view-model/component react-view-model/component
@parent can-views
@collection can-ecosystem
@group react-view-model/component.static 0 static

@description Create an auto-rendering container component with an observable view-model.

@signature `class App extends Component`

Create an auto-rendering [container component](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8) by connecting an observable [can-define/map/map] view-model to a React [presentational component](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8).

```javascript
import { Component } from 'react-view-model';

export default class AppComponent extends Component {
  ...
}

AppComponent.ViewModel = DefineMap.extend({
  ...
});
```

Every instance of the component will generate an instance of the ViewModel, initialized with the props, and provide it as `this.viewModel`. Whenever the container component receives new props, the new values are passed to the viewModel’s `.set()` method, which may in turn cause an observable change event, which will re-run the observed render process.

_Note: If you extend any of the [React lifecycle methods](https://facebook.github.io/react/docs/react-component.html#the-component-lifecycle), you must call `super` so as not to break the view-model binding. This includes: `componentWillReceiveProps`, `componentWillMount`, `componentDidMount`, `componentWillUpdate`, `componentDidUpdate`, and `componentWillUnmount`._


@body

## Use

An example application using the ViewModel to create an extra prop, whose value is derived from other props.

@demo demos/react-view-model/component.name.html

An example application which includes viewModel mutation and demonstrates auto-rendering.

@demo demos/react-view-model/component.counter.html

You can also play with the above example on JS Bin:

<a class="jsbin-embed" href="https://jsbin.com/lunajov/1/embed?js,output">react-view-model/component demo on jsbin.com</a>

You can also use this module with [Preact](https://preactjs.com):

<a class="jsbin-embed" href="https://jsbin.com/fuxerik/2/embed?js,output">react-view-model/component demo with Preact on jsbin.com</a>

Here’s a recreation of the clock example from [React’s State and Lifecycle docs](https://facebook.github.io/react/docs/state-and-lifecycle.html):

<a class="jsbin-embed" href="https://jsbin.com/zikaxuy/4/embed?js,output">react-view-model/component clock demo on jsbin.com</a>

<script src="https://static.jsbin.com/js/embed.min.js?4.0.4"></script>
