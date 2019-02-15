import PropTypes from 'prop-types';
import React, { useContext } from 'react';

const Context = React.createContext();

export default function ModelProvider({ children, ...models }) {
  const parent = useContext(Context);

  return (
    <Context.Provider value={{ parent, models }}>
      {children}
    </Context.Provider>
  );
}

ModelProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useModel(model) {
  const { parent, models } = useContext(Context);

  if (typeof model === 'string') {
    return extractModel(model, models, parent);
  }

  if (Array.isArray(model)) {
    const output = [];
    for (const key of model) {
      output.push(extractModel(key, models, parent));
    }

    return output;
  }

  if (typeof model === 'object') {
    const output = {};
    for (const key in model) {
      output[model[key]] = extractModel(key, models, parent);
    }

    return output;
  }

  throw new Error('useModel: Unexpected input.');
}

function extractModel(key, models, parent) {
  if (models[key]) {
    return models[key];
  }

  if (parent) {
    return extractModel(key, parent.models, parent.parent);
  }

  return undefined;
}
