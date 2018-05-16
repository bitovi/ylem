# ylem - Easy state management for React

[![Build Status](https://travis-ci.org/bitovi/ylem.svg?branch=master)](https://travis-ci.org/bitovi/ylem)
[![Greenkeeper Badge](https://badges.greenkeeper.io/bitovi/ylem.svg)](https://greenkeeper.io/)

> [ahy-luh m] *noun* `ASTRONOMY`
>   
> The primordial matter of the universe from which all matter is said to be derived, believed to be composed of neutrons at high temperature and density.

**ylem** provides fast and easy state management for your [React](https://reactjs.org) application by using [observable objects](https://canjs.com/doc/can-observe.html). Simply update your state objects whenever/however you want and your app will be re-rendered as efficiently as possible.

Read more about the benefits on the [ylem homepage](http://bitovi.github.io/ylem).

## Getting Started

```
npm install ylem --save
```

* [Configure with Webpack](./docs/getting-started-webpack.md)
* [Configure with StealJS](./docs/getting-started-steal.md)

## Usage

**If you know React, you already know ylem.** There are 3 different techniques for using **ylem**, all of which are based on popular conventions used by the React community. For the sake of simplicity, all examples will use the technique of extending `ylem.Component`.

* [Extend `ylem.Component` for observable state](./docs/use-observable-state.md)
* [`@connect` presentation components to observable data](./docs/use-higher-order-components.md)
* [Use render props with `createViewModelComponent()`](./docs/use-viewmodel-components.md)


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

Notice that instead of calling `.setState`, we were able to just set the `.date` property directly? We know [React tells you not to do this](https://reactjs.org/docs/state-and-lifecycle.html#do-not-modify-state-directly), but now you _can_ update state directly with **ylem**. This seemingly minor change has all sorts of benefits - read more about it on the [ylem homepage](http://bitovi.github.io/ylem).


## Contributing
Read the [contributing guides](./contributing.md)

## License
[MIT](./LICENSE.md) License