## 💡 Easy for developers of all skill levels to understand. 💡

**ylem** supports a simple object-oriented pattern that humans are built to understand.

> Object oriented programming leverages the fact that humans have millions of years of evolution invested in conceiving of the world in terms of things which have properties and associated methods of doing things with them. A salt shaker has a property of the amount of salt in it, and can be shaken.
>
> &mdash; <cite>Tim Boudreau, Oracle Labs</cite>

One of the benefits of using observable values is that changing the value just works, much like in VueJS. For instance, when dealing with arrays you can `.pop()` or `.splice()`.

```js
class List extends ylem.Component { // 👀
  constructor(props) {
    super(props);
    this.state = { items: [] };
  }

  add = () => {
    this.state.items.push(Math.floor(Math.random() * 100)); // 👀
  }

  replace(index) {
    this.state.item[index] = Math.floor(Math.random() * 100); // 👀
  }

  render() {
    return (
      <div>
        <ul>
          { this.state.items.map((item, index) => (
            <li key={index} onClick={() => this.replace(index)}>
              {item}
            </li>
          )) }
        </ul>
        <button onClick={this.add}>Add</button>
      </div>
    )
  }
}
```

## 💆 Remove boilerplate 💆

Often, many components operate on the same state. With plain react, the only way to re-render a component is to call `.setState`. This makes it cumbersome to setup lots of lines of communication. For example, lets say we have several pagination components that work together.

<table>
<tr><th>React</th><th>ylem</th></tr>
<tr>
<td>

With React alone, you might build your app like:

</td>
<td>

Instead of all the boilerplate, you can simply pass state:

</td>
</tr>
<tr>
<td>

```js
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: 10,
      offset: 20,
      count: 300
    };
  }

  setLimit = (limit) => {
    this.setState({ limit });
  }

  setOffset = (offset) => {
    this.setState({ offset });
  }

  render() {
    const { limit, offset, count } = this.state;

    return (
      <div>
        <NextPrev
          limit={limit}
          offset={offset}
          count={count}
          setOffset={this.setOffset}
        />
        <Grid
          limit={limit}
          offset={offset}
          count={count}
          setLimit={this.setLimit}
        />
      </div>
    );
  }
}
```

</td>
<td>

```js
class App extends ylem.Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: 10,
      offset: 20,
      count: 300
    };
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

</td>
</tr>
<tr>
<td>

Then a paginate control might look like:

</td>
<td>

And the paginate control would look like:

</td>
</tr>
<tr>
<td>

```js
render() {
  const { limit, offset } = this.state;
  return (
    <button onClick={() =>
      this.props.setOffset( offset + limit );
    }>NEXT<button>
  );
}
```

</td>
<td>

```js
render() {
  const { limit, offset } = this.props.paginate;
  return (
    <button onClick={() =>
      this.props.paginate.offset = ( offset + limit )
    }>NEXT<button>
  );
}
```

</td>
</tr>
</table>

As `setState` isn't being called anymore when pagination changes, this avoids re-rendering `App` and anything else that it may render 🔥.

## Less Boilerplate

As shown above, you can omit many properties and callbacks, in favor of simply passing portions or your state.

<table>
<tr><th>React</th><th>ylem</th></tr>
<tr>
<td>

With React alone, you might render like:

</td>
<td>

Instead of all the boilerplate, you can simply pass state:

</td>
</tr>
<tr>
<td>

```js
render() {
  const { limit, offset, count } = this.state;

  return (
    <div>
      <NextPrev
        limit={limit}
        offset={offset}
        count={count}
        setOffset={this.setOffset}
      />
      <Grid
        limit={limit}
        offset={offset}
        count={count}
        setLimit={this.setLimit}
      />
    </div>
  );
}
```

</td>
<td>

```js
render() {
  return (
    <div>
      <NextPrev paginate={this.state} />
      <Grid paginate={this.state} />
    </div>
  );
}
```

</td>
</tr>
</table>

## 🔥 Less Time Rendering 🔥

In the example above, since the properties being modified (`offset` and `limit`) are not used by the main component itself, it does not have to re-render when they change; only those components which use the modified properties will be updated. As `setState` isn't being called anymore when pagination changes, this avoids re-rendering App 🔥.

Next: [Get Started with StealJS](./getting-started-steal.md) or [Get Started with Webpack](./getting-started-webpack.md)
