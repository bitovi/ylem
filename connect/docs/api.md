## API

- `ylem()`
  - `ylem(Component)` -> returns an observer component (useful for making more efficient renders)
  - `ylem(ObserveObject, Component)` -> return and enhanced component
  - `ylem(ObserveObject, Component, opts)` -> same as above but with options (options include the `deriveUpdates` function)
  - `ylem(ObserveObject)(Component)` -> if no component is provided it returns a function that accepts a component
  - `ylem(ObserveObject, opts)(Component)` -> same as above but with options (options include the `deriveUpdates` function)
- `ObserverObject`
  - `.listenTo`
  - ObserveObject Decorators
    - `@getAsync`
    - `@resolvedBy`
- `ObserveArray`
- `connect(ObservableClass, opts)` alias `withStore`
- `createComponent(ObservableClass, opts)`
- `observer(Component)`
