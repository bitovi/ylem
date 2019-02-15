import canReflect from 'can-reflect';
import canDiff from 'can-diff';
import canKey from 'can-key';
import React, { useRef } from 'react';
import useObserver from './use-observer';

export default function useStore(Store, newProps, inputs) {
  useObserver(inputs);

  const store = useRef();
  if (!store.current) {
    store.current = new Store();
  }

  if (typeof newProps === 'function') {
    // eslint-disable-next-line no-param-reassign
    newProps = newProps(store.current);
  }

  // React needs the children object to different or it will not re-render
  // We need to remove the old one so that the new one will replace it, rather than merge
  delete store.current.children;

  const oldProps = useRef();
  if (newProps && newProps !== oldProps.current && newProps !== store.current) {
    updateStore(store.current, oldProps.current, newProps);
    oldProps.current = newProps;
  }

  return store.current;
}

function updateStore(store, oldProps, newProps) {
  const patches = canDiff.deep(oldProps, newProps);
  for (const { key, type, ...values } of patches) {
    if (type === 'add' || type === 'set') {
      // shallow clone of non-extensible objects and arrays
      if (typeof values.value === 'object' && !Object.isExtensible(values.value) && !React.isValidElement(values.value)) {
        if (canReflect.isMoreListLikeThanMapLike(values.value)) {
          values.value = [ ...values.value ];
        }
        else {
          values.value = { ...values.value };
        }
      }

      canKey.set(store, key, values.value);
    }

    if (type === 'delete') {
      canKey.delete(store, key);
    }

    if (type === 'splice') {
      const value = canKey.get(store, key);
      canReflect.splice(value, values.index, values.deleteCount, values.insert);
    }
  }
}
