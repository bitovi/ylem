import QUnit from 'steal-qunit';
import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';

import reflect from 'can-reflect';
import observe, { Object as ObserveObject } from 'can-observe';
import { Component } from 'ylem';

QUnit.module('Component', () => {
	QUnit.test('throws if non objects are used', (assert) => {
		class TestComponent extends Component {
			constructor(props) {
				super();
				this.state = props;
			}
		}
		assert.throws(() => new TestComponent('foo'));
		assert.throws(() => new TestComponent(123));
		assert.throws(() => new TestComponent(true));
		assert.throws(() => new TestComponent(null));
		assert.throws(() => new TestComponent(undefined));
		assert.throws(() => new TestComponent([]));
		assert.throws(() => new TestComponent(function() {}));
	});

	QUnit.test('Plain object state is made observable', (assert) => {
		const initialState = {
			foo: 'bar'
		};
		class TestComponent extends Component {
			constructor() {
				super();
				this.state = initialState;
			}
		}
		const instance = new TestComponent();
		assert.ok(reflect.isObservableLike(instance.state), 'state is an observe');
		assert.equal(instance.state.foo, 'bar');
	});

	QUnit.test('Existing observes are used for state', (assert) => {
		const initialState = observe({
			foo: 'bar'
		});
		class TestComponent extends Component {
			constructor() {
				super();
				this.state = initialState;
			}
		}
		const instance = new TestComponent();
		assert.ok(instance.state === initialState, 'Existing observe was used');
		assert.equal(instance.state.foo, 'bar');
	});

	QUnit.test('Existing observe.Objects are used for state', (assert) => {
		const initialState = new ObserveObject({
			foo: 'bar'
		});
		class TestComponent extends Component {
			constructor() {
				super();
				this.state = initialState;
			}
		}
		const instance = new TestComponent();
		assert.ok(instance.state === initialState, 'Existing observe.Object was used');
		assert.equal(instance.state.foo, 'bar');
	});

	QUnit.test('Attempts to replace state are merged onto existing state', (assert) => {
		class TestComponent extends Component {
			constructor() {
				super();
				this.state = { foo: 'bar' };
			}
		}
		const instance = new TestComponent();
		instance.state = { bam: 'quux' };
		assert.equal(instance.state.foo, 'bar');
		assert.equal(instance.state.bam, 'quux');
	});

	QUnit.test('Works with getDerivedStateFromProps', (assert) => {
		class TestComponent extends Component {
			static getDerivedStateFromProps(props, state) {
				state.foo = props.bar;
				return null;
			}
			constructor(props) {
				super(props);
				this.state = {};
			}
			render() {
				const { foo } = this.state;
				return <div>{foo}</div>;
			}
		}
		const testInstance = ReactTestUtils.renderIntoDocument( <TestComponent bar="bar" /> );
		assert.equal(testInstance.state.foo, 'bar');
	});
});
