# React View-Models

[![Build Status](https://travis-ci.org/canjs/react-view-models.png?branch=master)](https://travis-ci.org/canjs/react-view-models)
[![Greenkeeper badge](https://badges.greenkeeper.io/canjs/react-view-models.svg)](https://greenkeeper.io/)

Connect observable view-models to React [presentational components][1] to create auto rendering [container components][1].

## Install

### ES6

```js
import reactViewModel from 'react-view-models';
import { Component } from 'react-view-models';
import { makeReactComponent } from 'react-view-models';
```

### CommonJS

```js
var reactViewModel = require('react-view-models');
var Component = require('react-view-models').Component;
var makeReactComponent = require('react-view-models').makeReactComponent;
```

## Contributing
[Contributing](./contributing.md)

### Running the tests

Tests can run in the browser by opening a webserver and visiting the `test/test.html` page.
Automated tests that run the tests from the command line in Firefox can be run with

```
npm test
```

## License
[MIT](./LICENSE)

[1]: https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.v9i90qbq8
[2]: https://canjs.github.io/canjs/doc/can-define/map/map.html
