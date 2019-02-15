# ylem - Easy state management for React

> [ahy-luh m] *noun* `ASTRONOMY`
>
> The primordial matter of the universe from which all matter is said to be derived, believed to be composed of neutrons at high temperature and density.

## QA mode

**ylem** uses observable objects to determine when to re-render components. We are currently considering two APIs - each has its own README and docs:

1. Extend ylem's **`Component`** - `this.state` is observable, no more `.setState()`.
    [Read more here](./component).

2. **`connect()`** - connect an observable object to a presentation (aka. "dumb") component (similar to redux).
    [Read more here](./connect).
