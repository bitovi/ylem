# Beneits of using ylem

## 💡 Easy for developers of all skill levels to understand 💡

**ylem** uses observable objects to support a simple object-oriented pattern that humans are built to understand. One of the benefits of using observable values is that changing the value just works, much like in VueJS. For instance, when dealing with arrays you can `.pop()` or `.splice()`.

```js
import React from 'react';
import { Component } from 'ylem';

class List extends Component { // (◕‿◕ )
  constructor(props) {
    super(props);
    this.state = { items: [] };
    this.add = this.add.bind(this);
  }
  
  randomNum() {
    return Math.floor(Math.random() * 100);
  }

  add() {
    this.state.items.push(this.randomNum()); // (◕‿◕ )
  }

  replace(index) {
    this.state.item[index] = this.randomNum(); // (◕‿◕ )
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

## 💆 Removes boilerplate 💆

Often, many components operate on the same state. With plain react, the only way to re-render a component is to call `.setState`.  This makes it cumbersome to setup lots of lines of communication.  For example, lets say we have several pagination components that work together.

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
import React form 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: 10,
      offset: 20,
      count: 300
    };
    this.setLimit = this.setLimit.bind(this);
    this.setOffset = this.setOffset.bind(this);
  }

  setLimit(limit) {
    this.setState({ limit });
  }

  setOffset(offset) {
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
import { Component } form 'ylem';

class App extends Component {
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
