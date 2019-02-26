import QUnit from 'steal-qunit';
import React from 'react';
import { render, cleanup } from 'react-testing-library';
import { extractText } from './utils';

import { ModelProvider, useModel, ObserveObject } from '..';

QUnit.module('ModelProvider and useModel', hooks => {
  hooks.afterEach(cleanup);

  QUnit.test('basic usage', assert => {
    class Fooo extends ObserveObject {}
    class Barr extends ObserveObject {}

    function TestComponent() {
      const Foo = useModel('Foo');
      const Bar = useModel('Bar');

      assert.ok(typeof Foo === 'function', 'provides Foo');
      assert.ok(typeof Bar === 'function', 'provides Bar');

      return (
        <div data-testid="foo">
          {Foo.name} {Bar.name}
        </div>
      );
    }

    const { getByTestId } = render(
      <ModelProvider Foo={Fooo} Bar={Barr}>
        <TestComponent />
      </ModelProvider>
    );

    assert.equal(extractText(getByTestId('foo')), 'Fooo Barr');
  });

  QUnit.test('complex usage with array', assert => {
    class Fooo extends ObserveObject {}
    class Barr extends ObserveObject {}

    function TestComponent() {
      const [Foo, Bar] = useModel(['Foo', 'Bar']);

      assert.ok(typeof Foo === 'function', 'provides Foo');
      assert.ok(typeof Bar === 'function', 'provides Bar');

      return (
        <div data-testid="foo">
          {Foo.name} {Bar.name}
        </div>
      );
    }

    const { getByTestId } = render(
      <ModelProvider Foo={Fooo} Bar={Barr}>
        <TestComponent />
      </ModelProvider>
    );

    assert.equal(extractText(getByTestId('foo')), 'Fooo Barr');
  });

  QUnit.test('complex usage with object', assert => {
    class Fooo extends ObserveObject {}
    class Barr extends ObserveObject {}

    function TestComponent() {
      const { Fooo: Foo, Barr: Bar } = useModel({ Foo: 'Fooo', Bar: 'Barr' });

      assert.ok(typeof Foo === 'function', 'provides Foo');
      assert.ok(typeof Bar === 'function', 'provides Bar');

      return (
        <div data-testid="foo">
          {Foo.name} {Bar.name}
        </div>
      );
    }

    const { getByTestId } = render(
      <ModelProvider Foo={Fooo} Bar={Barr}>
        <TestComponent />
      </ModelProvider>
    );

    assert.equal(extractText(getByTestId('foo')), 'Fooo Barr');
  });

  QUnit.test('nested usage', assert => {
    class Fooo extends ObserveObject {}
    class Barr extends ObserveObject {}

    function TestComponent() {
      const Foo = useModel('Foo');
      const Bar = useModel('Bar');

      assert.ok(typeof Foo === 'function', 'provides Foo');
      assert.ok(typeof Bar === 'function', 'provides Bar');

      return (
        <div data-testid="foo">
          {Foo.name} {Bar.name}
        </div>
      );
    }

    const { getByTestId } = render(
      <ModelProvider Foo={Fooo}>
        <ModelProvider Bar={Barr}>
          <TestComponent />
        </ModelProvider>
      </ModelProvider>
    );

    assert.equal(extractText(getByTestId('foo')), 'Fooo Barr');
  });
});
