## Using `observe()` for Extra Rendering Efficiency

Sometimes, the component that stores the state is also expensive to re-render; if the state changes, the entire component must render again. With Ylem, however, a component will only update if the properties that it used changed.

Take this component, for example. The `filters.active` property is only being read inside the `Filters` component. However, as it is a plain React component not an Ylem component, its observable reads belong to the parent, so any changes to `filters.active` cause the whole `Results` component to re-render.

```js
export const Filters = ({ filters }) => (
  <div>
    <span>Active: {filters.active ? '✔️' : '✖️'}</span>
  </div>
);

export class ResultsStore extends ObserveObject {
  filters = {
    active: true,
  }

  get results() {
    return [
      // ...
    ];
  }
}

export const Results = ({ filters, results }) => (
  <div>
    <Filters filters={filters} />

    <div>
      {results.map((result) => (
        <div key={result}>{result}</div>
      ))}
    </div>
  </div>
);

export default connect(ResultsStore)(Results);
```

Instead if we wrap the Filters component in the `observe` function, it will have its own observable scope, so changes to `filters.active` will only re-render `Filters`.

```js
import { observe } from 'ylem';

export const Filters = observe(({ filters }) => (
  <div>
    <span>Active: {filters.active ? '✔️' : '✖️'}</span>
  </div>
));
```
