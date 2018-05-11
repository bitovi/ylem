# ylem - Easy state management for React

[![Build Status](https://travis-ci.org/bitovi/ylem.svg?branch=master)](https://travis-ci.org/bitovi/ylem)
[![Greenkeeper Badge](https://badges.greenkeeper.io/bitovi/ylem.svg)](https://greenkeeper.io/)

**ylem** provides reactive state management for your [React](https://reactjs.org) or [Preact](https://preactjs.com/) application. If you've ever just wanted to set properties and have react know to update itself without having to call `.setState` on every component correctly, ylem is for you.

If you know React, you already know ylem.

<table>
<tr><th>React</th><th>ylem</th></tr>
<tr>
<td>

React's [state and lifecycle guide](https://reactjs.org/docs/state-and-lifecycle.html#adding-local-state-to-a-class) shows how to use `this.state` to manage state in a component like the following:

</td>
<td>

With ylem you can simply change the state, any of the values within state and react will update; the example on the left now looks like:

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
class Clock extends ylem.Component { // 👀
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }

  componentDidMount() {
    this.timerID = setInterval(() => {
      this.state.date = new Date(); // 👀
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

Notice that instead of calling `.setState`, we were able to just set the `.date` property? This seemingly minor change has all sorts of benefits we will explore in the following sections:

+ Easy for developers of all skill levels to understand 💡
+ Less boilerplate 💆
+ Less time re-rendering 🔥

Are you ready to try it? [Get Started with StealJS](./getting-started-steal.md) or [Get Started with Webpack](./getting-started-webpack.md)

Have lingering questions, or want to know more? [Read more about ylem's benefits](./benefits.md):
- Is easy to debug.
- Creates unit-testable `ViewModel` types that protect state.
- Creates unit-testable `views` with higher order components.
- Connects to restful and real-time services.


## License
[MIT](../LICENSE.md)
