# API

- `ylem()`
    - `ylem(Component)` -> returns an observer component (useful for making more efficient renders)
    - `ylem(ObserveObject, Component)` -> return and enhanced component
    - `ylem(ObserveObject, Component, opts)` -> return and enhanced component (options include the `mapProps` function)
    - `ylem(ObserveObject)(Component)` -> if no component is provided it returns a function that accepts a component
    - `ylem(ObserveObject, opts)(Component)` -> same as above but with options
- `ObserverObject`
	- `.listenTo`
	- ObserveObject Decorators
		- `@async`
		- `@resolver`
- `ObserveArray`
- `connect(ObservableClass)` alias `withViewModel`
- `createComponent(ObservableClass)`
- `observer(Component)`
