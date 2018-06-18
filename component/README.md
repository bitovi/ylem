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

**If you know React and JavaScript, you already know ylem.** The following is a basic example of how to update state using **ylem**. Feel free to edit this example on [CodeSandbox](https://codesandbox.io/s/qx1nzj6r29?hidenavigation=1&module=%2Fsrc%2Fylem%2Fclock.js&moduleview=1).

<table>
<tr><th>React</th><th>ylem</th></tr>
<tr>
<td>

React's [state and lifecycle guide](https://reactjs.org/docs/state-and-lifecycle.html#adding-local-state-to-a-class) shows how to use `this.state` to manage state in a component like the following:

</td>
<td>

With __ylem__ you can simply change the state, any of the values within state and react will update.  With __ylem__, the example on the left now looks like:

</td>
</tr>
<tr>
<td>

```js
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }

  componentDidMount() {
    this.timerID = setInterval(() => {
      this.setState({ date: new Date() });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render() {
    const { date } = this.state;
    return (
      <h2>
        It is {date.toLocaleTimeString()}.
      </h2>
    );
  }
}
```

</td>
<td>

```js
import { Component } from 'ylem';

class Clock extends Component { // (◕‿◕ )
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }

  componentDidMount() {
    super.componentDidMount();
    this.timerID = setInterval(() => {
      this.state.date = new Date(); // (◕‿◕ )
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render() {
    const { date } = this.state;
    return (
      <h2>
        It is {date.toLocaleTimeString()}.
      </h2>
    );
  }
}
```

</td>
</tr>
</table>

Notice that instead of calling `.setState`, we were able to just set the `.date` property? This seemingly minor change has all sorts of [benefits you can read about here](./docs/benefits.md).


## Contributing
Read the [contributing guides](./contributing.md)

## License
[MIT](./LICENSE.md) License