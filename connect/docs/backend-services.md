## Backend Services

Inevitably, you will need to communicate with a backend. Ylem makes this very easy.

As long as you have a promise, it can be easily incorporated with Ylem. The resolved value is cached and will be used until its observable dependencies (in this case, `search`) change.

```js
import { getAsync } from 'ylem/property-decorators';

export class ResultsStore extends ObserveObject {
  search = ""

  setSearch = (search) => {
    this.search = search;
  }

  @getAsync
  get results() {
    return fetch(`https://swapi.co/api/people/?search=${this.search}`)
      .then(response => response.json())
      .then(response => response.results)
    ;
  }
}

export const Results = ({ search, setSearch, results }) => (
  <div>
    <input value={search} onChange={e => setSearch(e.target.value)} />

    { results ? (
      <div>
        { results.map(({ url, name }) => (
          <div key={url}>{name}</div>
        )) }
      </div>
    ) : null }
  </div>
);

export default connect(ResultsStore)(Results);
```
