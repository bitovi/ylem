import QUnit from 'steal-qunit';

import ylem, {
  useObserver,
  useStore,
  ModelProvider,
  useModel,
  ObserveObject,
  ObserveArray,
  decorators,
} from '..';

QUnit.module('yelm', () => {
  QUnit.test('has default export', assert => {
    assert.equal(typeof ylem.useObserver, 'function', 'exposes useObserver hook');
    assert.equal(typeof ylem.useStore, 'function', 'exposes useStore hook');

    assert.equal(typeof ylem.ModelProvider, 'function', 'exposes ModelProvider component');
    assert.equal(typeof ylem.useModel, 'function', 'exposes useModel hook');

    assert.equal(typeof ylem.ObserveObject, 'function', 'exposes ObserveObject constructor');
    assert.equal(typeof ylem.ObserveArray, 'function', 'exposes ObserveArray constructor');

    assert.equal(typeof ylem.decorators, 'object', 'exposes decorators container');
    assert.equal(typeof ylem.decorators.getAsync, 'function', 'exposes getAsync decorator');
    assert.equal(typeof ylem.decorators.resolvedBy, 'function', 'exposes resolvedBy decorator');
  });

  QUnit.test('has named exports', assert => {
    assert.equal(typeof useObserver, 'function', 'exposes useObserver hook');
    assert.equal(typeof useStore, 'function', 'exposes useStore hook');

    assert.equal(typeof ModelProvider, 'function', 'exposes ModelProvider component');
    assert.equal(typeof useModel, 'function', 'exposes useModel hook');

    assert.equal(typeof ObserveObject, 'function', 'exposes ObserveObject constructor');
    assert.equal(typeof ObserveArray, 'function', 'exposes ObserveArray constructor');

    assert.equal(typeof decorators, 'object', 'exposes decorators container');
    assert.equal(typeof decorators.getAsync, 'function', 'exposes getAsync decorator');
    assert.equal(typeof decorators.resolvedBy, 'function', 'exposes resolvedBy decorator');
  });
});
