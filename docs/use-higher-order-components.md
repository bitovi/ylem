## Higher Order Component (HoC)

The `connect()` method provided by **ylem** is a HoC factory function that allows you to **enhance** "dumb" or [Presentational React components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8) into "smart" a.k.a. [Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8) by "connecting" them to an observable ViewModel. Similar to react-redux, **ylem** allows a clean separation of the view and the data, leading to easier testing and greater maintainability.

```js
import React from 'react';
import ylem, { connect } from 'ylem';

export class ViewModel extends ylem.Object {
  showMenu = true;

  toggleMenu = () => {
    this.showMenu = !this.showMenu;
  }
}

export const MenuToggle = ({ showMenu, toggleMenu }) => (
  <div>
    <button onClick={toggleMenu} />
    { showMenu
      ? <Menu />
      : null
    }
  </div>
);

export default connect(ViewModel)(MenuToggle);
```

If you are able to use [ES Decorators](https://babeljs.io/docs/plugins/transform-decorators/), the connect method works nicely as a decorator too.

```js
import React from 'react';
import ylem, { connect } from 'ylem';

export class ViewModel extends ylem.Object {
  showMenu = true;

  toggleMenu = () => {
    this.showMenu = !this.showMenu;
  }
}

@connect(ViewModel)
export default class MenuToggle extends Component {
  render() {
    const { showMenu, toggleMenu } = this.props;
    return (
      <div>
        <button onClick={toggleMenu} />
        { showMenu
          ? <Menu />
          : null
        }
      </div>
    );
  }
}
```

The `connect()` method is also aliased as `withViewModel()`, following the pattern from the HoC library [Recompose](https://github.com/acdlite/recompose), and works well alongside the Recompose API and all the features Recompose offers.

Next: [ViewModel Components](./use-viewmodel-components.md)
