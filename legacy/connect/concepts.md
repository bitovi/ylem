# Concepts

`BaseComponent`
	- the base component is the React component passed to the `connect()` HoC function or the value passed as the `component` prop of an `ObservableComponent`
	- just a React component, may either be a function or an subclass of `React.Component`

`ObserverComponent`
	- a component class who's render is observed by a can observer
	- this can be `extend`ed by the user, or internally for advanced classes
	- observes property "reads" (getters) of observable and re-renders when any read property changes

`ObservableComponent`
	- a Component created from an observable with `createComponent()`
	- `ObservableComponent` extends `ObserverComponent`
	- Any props it receives will be assigned to the backing `Observable` instance, and the children will be a render prop called with the `Observable` instance as the sole argument
	- if the `component` prop is used, and passed an instance of `React.Component`, the `BaseComponent` passed will be extended into an `ObservablePropsComponent` (see below)

`ObservablePropsComponent` a.k.a. `ExtendedBaseComponent`
	- a component class, who's `.props` property is actually an observable
	- when `connect`ing a component, the `BaseComponent` class can't be passed an `Observable` instance as props (unless it is a function component). For performance concerns, we need the props passed to `BaseComponent` to be the `Observable` instance because React shallowly clones props passed into it
	- to overcome this limitation, for performance reasons, we `extend` the `BaseComponent` and change it so that it takes `_observable` as props and then uses proxy traps to return that whenever someone accesses `this.props` in the component.
	- it is a crazy work around, but it ensures the `this.props` is the observable instance from `connect` and not a shallow clone of it

`ConnectedComponent`
	- the returned value from `enhance()` which is itself the return value of the `connect()` HoC function
	- extends the `ObservableComponent` created from the passed `ObservableClass` who's child function component just renders the `ObservablePropsComponent` created from `BaseComponent`
