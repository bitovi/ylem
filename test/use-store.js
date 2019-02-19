import QUnit from 'steal-qunit';
import React from 'react';
import { render, fireEvent, cleanup } from 'react-testing-library';
import { extractText } from './utils';

import { useStore, ObserveObject } from '..';

QUnit.module('useStore', (hooks) => {
  hooks.afterEach(cleanup);

  QUnit.test('basic rendering', (assert) => {
    class Store extends ObserveObject {
      constructor() {
        super();
        assert.deepEqual(arguments.length, 0, 'constructor is called with no arguments');

        this.foo = 'foo';
      }
    }

    function TestComponent(props) {
      const { foo, bar } = useStore(Store, props);

      assert.ok(typeof foo !== 'undefined', 'store has foo');
      assert.ok(typeof bar !== 'undefined', 'store has bar');

      return (
        <div data-testid="foobar">
          {foo}
          {bar}
        </div>
      );
    }

    const { getByTestId } = render(<TestComponent bar="bar" />);

    assert.equal(extractText(getByTestId('foobar')), 'foobar');
  });

  QUnit.test('should update whenever the store changes', (assert) => {
    class Store extends ObserveObject {
      constructor() {
        super();
        assert.deepEqual(arguments.length, 0, 'constructor is called with no arguments');

        this.foo = 'foo';
      }

      handleClick = () => {
        this.bar = 'bam';
      }
    }

    function TestComponent(props) {
      const { foo, bar, handleClick } = useStore(Store, props);

      assert.ok(typeof foo !== 'undefined', 'store has foo');
      assert.ok(typeof bar !== 'undefined', 'store has bar');

      return (
        <div>
          {/* eslint-disable-next-line max-len */}
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <div data-testid="button" onClick={handleClick}>change</div>
          <div data-testid="foobar">
            {foo}
            {bar}
          </div>
        </div>
      );
    }

    const { getByTestId } = render(<TestComponent bar="bar" />);

    assert.equal(extractText(getByTestId('foobar')), 'foobar', 'starts with the correct value');

    fireEvent(
      getByTestId('button'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    );

    assert.equal(extractText(getByTestId('foobar')), 'foobam', 'updates to the correct value');
  });
});
