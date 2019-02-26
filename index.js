import namespace from 'can-namespace';
import { Object as ObserveObject, Array as ObserveArray } from 'can-observe';

import useObserver from './lib/use-observer';
import useStore from './lib/use-store';
import ModelProvider, { useModel } from './lib/model-provider';
import * as decorators from './decorators';

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
export { useObserver, useStore, ModelProvider, useModel, ObserveObject, ObserveArray, decorators };
