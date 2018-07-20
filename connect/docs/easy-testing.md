## Easy Testing

One of the benefits of separating your View from your CounterStore is ease of testing: your view need only test that it shows the correct information and that it calls the correct handler functions; your store need only test that it provides the correct information.

_Note: These tests are written using [mocha](https://mochajs.org/) and the assertions are using the [chai assertion library](http://www.chaijs.com/api/bdd/). This process is testing system agnostic however, and can be ported to whatever test runner you are using._

### The App

For example, lets say you have this app. We will need two kinds of tests.

```js
export class CounterStore extends ObserveObject {
  count = 0

  increment = () => {
    this.count++;
  }
}

export const Counter = ({ count, increment }) => (
  <div>
    <span id="count">{count}</span>
    <button onClick={increment}>+</button>
  </div>
);

export default ylem(CounterStore, Counter);
```

### Testing the Store

The first tests are for the Store, `store.test.js`. We want to verify the initial value of `count`, that `increment` increases that count, and that `increment` is bound to the instance, so React can call it properly.

```js
import { expect } from 'chai';

import { CounterStore } from './app.js';

describe('CounterStore', () => {
  describe('count property', () => {
    it('is initialized at 0', () => {
      const store = new CounterStore();

      expect(store).to.have.property('count', 0);
    });
  });

  describe('increment method', () => {
    it('increases the count property', () => {
      const store = new CounterStore();
      store.increment();

      expect(store).to.have.property('count', 1);
    });

    it('is bound to the instance', () => {
      const store = new CounterStore();

      const increment = store.increment;
      increment();

      expect(store).to.have.property('count', 1);
    });
  });
});
```

### Testing the View

Lastly, we need tests for the View, `view.test.js`. In this case, we need only verify that the count is shown as expected, and that clicking the button calls the `increment` function.

```js
import { expect } from 'chai';
import TestRenderer from 'react-test-renderer';

import { Counter } from './app.js';

describe('Counter', () => {
  describe('count property', () => {
    it('is displayed as expected', () => {
      const renderer = TestRenderer.create(
        <Counter count={29} />
      );

      // note: children is an array
      const count = renderer.root.findByProps({ id: 'count' });
      expect(count.children).to.include('29');
    });
  });

  describe('increment property', () => {
    it('is called when the button is clicked', () => {
      let called = false;
      const renderer = TestRenderer.create(
        <Counter increment={() => called = true} />
      );

      const buttons = renderer.root.findAllByType('button');
      expect(called).to.equal(false);
      buttons[1].props.onClick();
      expect(called).to.equal(true);
    });
  });
});
```

By separating the component into its Store and View, we can separate our tests the same way. This makes them simpler, and makes it much easier to find problems. Further, if you were to re-use this View with multiple Stores, all you need to do is test that all the stores pass this same suite.
