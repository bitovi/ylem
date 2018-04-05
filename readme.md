# React-View-Model

[![Build Status](https://travis-ci.org/canjs/react-view-model.png?branch=master)](https://travis-ci.org/canjs/react-view-model)
[![Greenkeeper badge](https://badges.greenkeeper.io/canjs/react-view-model.svg)](https://greenkeeper.io/)

Connect [CanJS](https://canjs.com/) observables to [React](https://reactjs.org/) components to create auto rendering [smart/container components][1].

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
    * [`Observable State`](#observable-state)
    * [`Higher Order Component(HoC)`](#higher-order-component-hoc)
    * [`Render Props`](#render-props)
* [Test Utils](#rvm-test-utils)
* [API Docs](#api)
* [Contributing](#contributing)
* [LICENSE](#license)

## Installation

### ES6

```js
import reactViewModel from 'react-view-model';
// or
import { Component, connect, createComponent } from 'react-view-model';
```

### CommonJS

```js
const reactViewModel = require('react-view-model');
// or
const { Component, connect, createComponent } = require('react-view-model');
```

## Usage

### Observable State
The most basic use of **react-view-model** is to create a component with observable state.

```js
import React from 'react';
import { Component } from 'react-view-model';
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

React-View-Model gives your React components access to entire CanJS ecosystem of observables, data modeling and more, and your components will auto render when any observable value changes.

_*Learn more about our Observer Component API in our [Component Docs](./docs/api/component.md)_

---

React-View-Model also provides 2 great MVVM focused functions for Building Apps with CanJS and React, using the common React patterns: Higher order Components and Render Props.

### Higher Order Component (HoC)
The [`connect()`](./docs/api/connect.md) method provided by react-view-model is a HoC factory function that follows a pattern of **enhancing** "dumb" or [Presentational React components][1] into "smart" a.k.a. [Container Components][1] by "connecting" them to an observable CanJS ViewModel.

```js
import React from 'react';
import { connect } from 'react-view-model';
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

Similar to, and inspired by, React-Redux, RVM allows a clean separation of the view and the data, which leads to easier testing and great maintainability.

If you are able to use [ES Decorators](https://babeljs.io/docs/plugins/transform-decorators/), the connect method works nicely as a decorator too.

```js
import React from 'react';
import { connect } from 'react-view-model';
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
The [`createComponent()`](./docs/api/create-component.md) function provided by react-view-model produces React Components that accept [Render Props](https://reactjs.org/docs/render-props.html) or a **function as child**, out of a Observable CanJS class.

```js
import React from 'react';
import { createComponent } from 'react-view-model';
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

## RVM Test Utils
The [`test-utils`](./docs/api/test-utils.md) module provides some utility methods to make testing your React-View-Model components easy.

* [`mock()`](./docs/api/test-utils.md#mock) provides quick mocking of the behaviors of the connected observables so you can test your react components without triggering side effects
* [`getViewModel()`](./docs/api/test-utils.md#getviewmodel) extracts the ViewModel class from an RVM component class, great for when you are using ES Decorators
* [`getComponent()`](./docs/api/test-utils.md#getcomponent) extracts the dumb/presentational component from an enhanced smart/container component

Mock Example

```javascript
import { mock } from 'react-view-model/test-utils';
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
Checkout our in depth [API Docs here](./docs/api/index.md) or on the [CanJS website](https://canjs.com/doc/react-view-model.html)

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
