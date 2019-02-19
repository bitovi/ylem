/* eslint-disable react/prop-types */
import QUnit from 'steal-qunit';
import React from 'react';
import { render, cleanup } from 'react-testing-library';
import { extractText } from './utils';

import { useObserver, ObserveObject } from '..';

class Store extends ObserveObject {}
const store = new Store({
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
});

function makeComponent(name) {
  function Component({ children }) {
    useObserver();

    if (children) {
      return (
        <div>{name}[ {children} ] </div>
      );
    }

    return <div>{name}</div>;
  }

  Component.displayName = name;

  return Component;
}

QUnit.module('useObserver', (hooks) => {
  hooks.afterEach(cleanup);

  QUnit.test('basic rendering', (assert) => {
    const A = makeComponent('A');
    const B1 = makeComponent('B1');
    const B2 = makeComponent('B2');
    const C11 = makeComponent('C11');
    const C12 = makeComponent('C12');
    const C21 = makeComponent('C21');
    const C22 = makeComponent('C22');

    const { container } = render((
      <A>
        <B1>
          <C11 />
          <C12 />
        </B1>
        <B2>
          <C21 />
          <C22 />
        </B2>
      </A>
    ));

    assert.equal(extractText(container), 'A[ B1[ C11C12 ] B2[ C21C22 ]  ] ');
  });

  QUnit.test('ugly rendering', (assert) => {
    function A({ thing }) {
      useObserver();

      return (
        <div>
          A{store[thing]}
          <B thing={2} />
          <B thing={4} />
        </div>
      );
    }

    function B({ thing }) {
      useObserver();

      return (
        <div>
          B{store[thing]}
          <C thing={thing + 1} />
        </div>
      );
    }

    function C({ thing }) {
      useObserver();

      return (
        <div>
          C{store[thing]}
        </div>
      );
    }

    const { container } = render((
      <A thing={1} />
    ));

    assert.equal(extractText(container), 'A1B2C3B4C5');
    store[5] = 0;
    assert.equal(extractText(container), 'A1B2C3B4C0');
  });
});
