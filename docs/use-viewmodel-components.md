## ViewModel Components

The `createViewModelComponent()` function provided by **ylem** produces React Components that accept [Render Props](https://reactjs.org/docs/render-props.html) or a **function as child**, out of a ViewModel class; this is the same class you might use with observable state.

```js
export class ViewModel extends ylem.Object {
  showMenu = true;

  toggleMenu = () => {
    this.showMenu = !this.showMenu;
  }
}

export const VMComponent = createViewModelComponent(ViewModel);

const MenuToggle = () => (
  <div>
    ...
    <VMComponent render={ ({ showMenu, toggleMenu }) => (
      <button onClick={toggleMenu} />
      { showMenu
        ? <Menu />
        : null
      }
    )} />
    ...
  </div>
);

export default MenuToggle;
```

This allows full control over your rendering, while still offering the auto-updating and easy state management that the CanJS observables and ecosystem have to offer.

Next: [Read more about ylem's benefits](./benefits.md)
