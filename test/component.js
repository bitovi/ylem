import QUnit from 'steal-qunit';
import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';

import reflect from 'can-reflect';
import observe, { Object as ObserveObject } from 'can-observe';
import { Component } from 'ylem';

QUnit.module('Component', () => {
	QUnit.test('throws if non objects are used for state', (assert) => {
		const vals = ['foo', 123, true, null, undefined, [], function() {}];
		assert.expect(vals.length);

		class TestComponent extends Component {
			constructor(props) {
				super();
				this.state = props;
			}
		}

		vals.forEach(val => assert.throws(() => new TestComponent(val)));
	});

	QUnit.test('plain object state is made observable', (assert) => {
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

	QUnit.test('existing observes are used for state', (assert) => {
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

	QUnit.test('existing observe.Objects are used for state', (assert) => {
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

	QUnit.test('attempts to replace state are merged onto existing state', (assert) => {
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

	QUnit.test('updates trigger a rerender', (assert) => {
		class TestComponent extends Component {
			constructor() {
				super();
				this.state = { foo: 'bar' };
			}
			render() {
				const { foo } = this.state;
				return <div>{foo}</div>;
			}
		}

		const testInstance = ReactTestUtils.renderIntoDocument( <TestComponent /> );
		const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'div' );

		assert.equal(divComponent.innerText, 'bar');
		testInstance.state.foo = 'baz';
		assert.equal(divComponent.innerText, 'baz');
	});

	QUnit.test('works with getDerivedStateFromProps', (assert) => {
		class TestComponent extends Component {
			static getDerivedStateFromProps(props, state) {
				state.foo = props.bar;
			}
			render() {
				const { foo } = this.state;
				return <div>{foo}</div>;
			}
		}

		const testInstance = ReactTestUtils.renderIntoDocument( <TestComponent bar="bar" /> );
		assert.equal(testInstance.state.foo, 'bar');
	});

	QUnit.test('warns if getDerivedStateFromProps returns anything', (assert) => {
		/* eslint-disable no-console */
		const vals = [undefined, null, {}];
		const oldWarn = console.warn;
		console.warn = () => assert.ok(true);

		// one of the vals is 'undefined', which should not warn
		assert.expect(vals.length - 1);

		vals.forEach(val => {
			class TestComponent extends Component {
				static getDerivedStateFromProps() {
					return val;
				}
				render() {
					return <div />;
				}
			}

			ReactTestUtils.renderIntoDocument( <TestComponent /> );
		});

		console.warn = oldWarn;
	});
});
