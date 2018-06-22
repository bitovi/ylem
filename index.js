import React from 'react';
import namespace from 'can-namespace';
import { Object as ObserveObject, Array as ObserveArray } from 'can-observe';

import ylem from './lib/ylem';
import { connect } from './lib/connected-component';
import { createComponent } from './lib/observable-component';
import { Component, observer } from './lib/observer-component';
import * as propertyDecorators from './property-decorators';

//!steal-remove-start
(function(version) {
	const [ major, minor ] = version.split('.').map(v => +v);
	if (major < 16 || (major === 16 && minor < 3)) {
		throw new Error(`ylem requires at least React v16.3. Currently ${version}`);
	}
})(React.version);
//!steal-remove-end

Object.assign(ylem, {
	observer,
	connect,
	withViewModel: connect,
	createComponent,
	Component,

	ObserveObject,
	ObserveArray,
	propertyDecorators,
});

namespace.ylem = ylem;

export default namespace.ylem;
export {
	observer,
	connect,
	connect as withViewModel,
	createComponent,
	Component,

	ObserveObject,
	ObserveArray,
	propertyDecorators,
};
