# ylem

[![Build Status](https://travis-ci.org/bitovi/ylem.png?branch=master)](https://travis-ci.org/bitovi/ylem)
[![Greenkeeper badge](https://badges.greenkeeper.io/bitovi/ylem.svg)](https://greenkeeper.io/)

*noun* `ASTRONOMY`

(in the Big Bang theory) the primordial matter of the universe, originally conceived as composed of neutrons at high temperature and density.

Connect [CanJS](https://canjs.com/) observables to [React](https://reactjs.org/) components to create auto rendering [smart/container components][1].

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
    * [`Observable State`](#observable-state)
    * [`Higher Order Component(HoC)`](#higher-order-component-hoc)
    * [`Render Props`](#render-props)
* [Test Utils](#ylem-test-utils)
* [API Docs](#api)
* [Contributing](#contributing)
* [LICENSE](#license)

## Installation

### ES6

```js
import reactViewModel from 'ylem';
// or
import { Component, connect, createComponent } from 'ylem';
```

### CommonJS

```js
const reactViewModel = require('ylem');
// or
const { Component, connect, createComponent } = require('ylem');
```

## Usage

### Observable State
The most basic use of **ylem** is to create a component with observable state.

```js
import React from 'react';
import { Component } from 'ylem';
import observe from 'can-observe';

class MyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = observe({
      showMenu: false
    });
  }

  toggleMenu = () => {
    this.state.showMenu = !this.state.showMenu;
  }

  render() {
    return (
      <div>
        <button onClick={ this.toggleMenu } />
        { this.state.showMenu
          ? <Menu />
          : null
        }
      </div>
    )
  }
}
```

ylem gives your React components access to entire CanJS ecosystem of observables, data modeling and more, and your components will auto render when any observable value changes.

_*Learn more about our Observer Component API in our [Component Docs](./docs/api/component.md)_

---

ylem also provides 2 great MVVM focused functions for Building Apps with CanJS and React, using the common React patterns: Higher order Components and Render Props.

### Higher Order Component (HoC)
The [`connect()`](./docs/api/connect.md) method provided by ylem is a HoC factory function that follows a pattern of **enhancing** "dumb" or [Presentational React components][1] into "smart" a.k.a. [Container Components][1] by "connecting" them to an observable CanJS ViewModel.

```js
import React from 'react';
import { connect } from 'ylem';
import { Object as ObserveObject } from 'can-observe';

export class ViewModel extends ObserveObject {
  showMenu = true;

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }
}

export const MenuToggle = ({ showMenu, toggleMenu }) => (
  <div>
    <button onClick={ toggleMenu } />
    { showMenu
      ? <Menu />
      : null
    }
  </div>
);

export default connect(ViewModel)(MenuToggle);
```

Similar to, and inspired by, React-Redux, ylem allows a clean separation of the view and the data, which leads to easier testing and great maintainability.

If you are able to use [ES Decorators](https://babeljs.io/docs/plugins/transform-decorators/), the connect method works nicely as a decorator too.

```js
import React from 'react';
import { connect } from 'ylem';
import { Object as ObserveObject } from 'can-observe';

export class ViewModel extends ObserveObject {
  showMenu = true;

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }
}

@connect(ViewModel)
export default class MenuToggle extends Component {
  render({ showMenu, toggleMenu }) => (
    <div>
      <button onClick={ toggleMenu } />
      { showMenu
        ? <Menu />
        : null
      }
    </div>
  );
}
```

The [`connect()`](./docs/api/connect.md) method is also aliased as `withViewModel()`, following the pattern from the fantastic HoC library [Recompose](https://github.com/acdlite/recompose), and works well alongside the Recompose API and all the features Recompose offers.

_*Learn more about our connect API in our [connect Docs](./docs/api/connect.md)_

### Render Props
The [`createComponent()`](./docs/api/create-component.md) function provided by ylem produces React Components that accept [Render Props](https://reactjs.org/docs/render-props.html) or a **function as child**, out of a Observable CanJS class.

```js
import React from 'react';
import { createComponent } from 'ylem';
import { Object as ObserveObject } from 'can-observe';

export class ViewModel extends ObserveObject {
  showMenu = true;

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }
}

export const VMComponent = createComponent(ViewModel);

const MenuToggle = () => (
  <div>
    <VMComponent render={ ({ showMenu, toggleMenu }) => (
      <button onClick={ toggleMenu } />
      { showMenu
        ? <Menu />
        : null
      }
    )} />
  </div>
);

export default MenuToggle;
```

This allows full control over your rendering, while still offering the auto-updating and easy state management that the CanJS observables and ecosystem have to offer.

_*Learn more about our connect API in our [createComponent Docs](./docs/api/create-component.md)_

## ylem Test Utils
The [`test-utils`](./docs/api/test-utils.md) module provides some utility methods to make testing your ylem components easy.

* [`mock()`](./docs/api/test-utils.md#mock) provides quick mocking of the behaviors of the connected observables so you can test your react components without triggering side effects
* [`getViewModel()`](./docs/api/test-utils.md#getviewmodel) extracts the ViewModel class from an ylem component class, great for when you are using ES Decorators
* [`getComponent()`](./docs/api/test-utils.md#getcomponent) extracts the dumb/presentational component from an enhanced smart/container component

Mock Example

```javascript
import { mock } from 'ylem/test-utils';
import Header from './header';
import Profile from 'components/profile';

describe('Header Component (which renders a Container Profile component)', ()=>{
  let release;
  before(()=>{
    release = mock(Profile, (props) => {
      expect(props).to.contain('id').that.equals(5);

      return {
        person: {
          name: foo,
        };
      };
    });
  });

  //... test the Header Component

  after(()=>{
    release();
  });
}
```


## API Docs
Checkout our in depth [API Docs here](./docs/api/index.md) or on the [CanJS website](https://canjs.com/doc/ylem.html)

## Contributing
Checkout out our docs on [Contributing](./contributing.md)

### Running the tests

You can run the tests by first cloning the repo and running `npm install` in the root of the directory.

Tests can then be run in the browser by opening a webserver and visiting the `test/test.html` page.
Automated tests that run the tests from the command line in Firefox can be run with

```
npm test
```

## License
[MIT](./LICENSE)

[1]: https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8
