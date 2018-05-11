## Observable State

The easiest way to use **ylem** is as a replacement for React's `state`, requiring only that you extend our `Component` instead of React's. With this, you can simply change the state, any of the values within state and React will update.

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

## ViewModel Classes

If passing state around so it can be mutated directly seems too "wild west", use ylem to define testable types that protect the state with accessors, methods, and setters.

```js
class PaginateState extends ylem.Object {
  constructor(data) {
    super(data);

    this.count = this.count || Infinity;
    this.offset = this.offset || 0;
    this.limit = this.limit || 10;
  }

  set offset(newOffset) {
    this._offset = Math.max(
      0,
      Math.min(
        !isNaN(this.count - 1) ? this.count - 1 : Infinity,
        newOffset
      )
    );
  }
  get offset() {
    return this._offset;
  }

  next = () => {
    this.offset += this.limit;
  }

  // ...
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = new PaginateState({
      offset: 20,
      limit: 10,
    });
  }

  render() {
    return (
      <div>
        <NextPrev paginate={this.state} />
        <Grid paginate={this.state} />
      </div>
    );
  }
}
```

Then the paginate control might look like:

```js
render() {
  return (
    <button onClick={this.props.paginate.next}>NEXT<button>
  );
}
```

Next: [Higher Order Components](./use-higher-order-components.md)
