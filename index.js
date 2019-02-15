import namespace from 'can-namespace';
import { Object as ObserveObject, Array as ObserveArray } from 'can-observe';

import useObserver from './lib/use-observer';
import useStore from './lib/use-store';
import ModelProvider, { useModel } from './lib/model-provider';
import * as decorators from './decorators';

//!steal-remove-start
// eslint-disable-next-line import/order
import React from 'react';

if (process.env.NODE_ENV !== 'production') {
  const [ major, minor ] = React.version.split('.').map(v => +v);
  if (major < 16 || (major === 16 && minor < 8)) {
    throw new Error(`ylem requires at least React v16.8.0; currently ${React.version}`);
  }
}
//!steal-remove-end

namespace.ylem = {
  useObserver,
  useStore,

  ModelProvider,
  useModel,

  ObserveObject,
  ObserveArray,
  decorators,
};

export default namespace.ylem;
export {
  useObserver,
  useStore,

  ModelProvider,
  useModel,

  ObserveObject,
  ObserveArray,
  decorators,
};
