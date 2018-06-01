# ylem - Easy state management for React

[![Build Status](https://travis-ci.org/bitovi/ylem.svg?branch=master)](https://travis-ci.org/bitovi/ylem)
[![Greenkeeper Badge](https://badges.greenkeeper.io/bitovi/ylem.svg)](https://greenkeeper.io/)

**ylem** provides fast and easy state management for your [React](https://reactjs.org) application by using [observable objects](https://canjs.com/doc/can-observe.html). Simply update your state objects whenever/however you want and your app will be re-rendered as efficiently as possible.

## Getting Started

```
npm install ylem --save
```

* [Configure with Webpack](./docs/getting-started-webpack.md)
* [Configure with StealJS](./docs/getting-started-steal.md)

## Usage

**If you know React and JavaScript, you already know ylem.** The following is a basic example of how to update state using **ylem**. Feel free to edit this example on [CodeSandbox](https://codesandbox.io/s/qx1nzj6r29?hidenavigation=1&module=%2Fsrc%2Fylem%2Fhello-world.js&moduleview=1).

1. **Step 1:** Extend **ylem's** `Component` instead of `React.Component`:

    ```js
    import React from 'react';
    import { Component } from 'ylem';
    
    class HelloWorld extends Component {
      constructor(props) {
        super(props);
        this.state = {
          name: 'Justin'
        };
      }
      render() {
        return (
          <div>
          	Hello {this.state.name}!
          </div>
        );
      }
    }
    ```

2. **Step 2:** update state directly! Continuing with the last example, notice how you can update state directly:

    ```js
    import React from 'react';
    import { Component } from 'ylem';
    
    class HelloWorld extends Component {
      constructor(props) {
        super(props);
        this.state = {
          name: 'Justin'
        };
      }
      
      updateName = (ev) => {
        // no need to call this.setState();
        this.state.name = ev.target.value;
      }
      
      render() {
        return (
          <div>
          	Hello {this.state.name}!
          	<div>
          	  <input onChange={this.updateName} />
          	</div>
          </div>
        );
      }
    }
    ```

Notice that instead of calling `.setState`, we were able to just set the `.name` property directly? We know [React tells you not to do this](https://reactjs.org/docs/state-and-lifecycle.html#do-not-modify-state-directly), but now you _can_ update state directly with **ylem**. This seemingly minor change has all sorts of benefits - read more about it on the [ylem homepage](http://bitovi.github.io/ylem).


## Contributing
Read the [contributing guides](./contributing.md)

## License
[MIT](./LICENSE.md) License