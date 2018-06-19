import QUnit from 'steal-qunit';
import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';

import reflect from 'can-reflect';
import observe, { Object as ObserveObject } from 'can-observe';
import { Component } from 'ylem';

QUnit.module('Component', () => {

	QUnit.test('plain object store is made observable', (assert) => {

		class TestComponent extends Component {
			constructor() {
				super();
				this.store = {
					foo: 'bar'
				};
			}
		}

		const instance = new TestComponent();
		assert.ok(reflect.isObservableLike(instance.store), 'store is an observe');
		assert.equal(instance.store.foo, 'bar');
	});

	QUnit.test('existing observes are used for store', (assert) => {
		const initialStore = observe({
			foo: 'bar'
		});

		class TestComponent extends Component {
			constructor() {
				super();
				this.store = initialStore;
			}
		}

		const instance = new TestComponent();
		assert.ok(instance.store === initialStore, 'Existing observe was used');
		assert.equal(instance.store.foo, 'bar');
	});

	QUnit.test('existing observe.Objects are used for store', (assert) => {
		const initialStore = new ObserveObject({
			foo: 'bar'
		});

		class TestComponent extends Component {
			constructor() {
				super();
				this.store = initialStore;
			}
		}

		const instance = new TestComponent();
		assert.ok(instance.store === initialStore, 'Existing observe.Object was used');
		assert.equal(instance.store.foo, 'bar');
	});

	QUnit.test('updates trigger a rerender', (assert) => {
		class TestComponent extends Component {
			constructor() {
				super();
				this.store = { foo: 'bar' };
			}
			render() {
				const { foo } = this.store;
				return <div>{foo}</div>;
			}
		}

		const testInstance = ReactTestUtils.renderIntoDocument( <TestComponent /> );
		const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'div' );

		assert.equal(divComponent.innerText, 'bar');
		testInstance.store.foo = 'baz';
		assert.equal(divComponent.innerText, 'baz');
	});

	QUnit.test('can work with getDerivedStateFromProps', (assert) => {
		class TestComponent extends Component {
			static getDerivedStateFromProps(props, { store }) {
				store.foo = props.foo;
				return null;
			}
			constructor(props) {
				super(props);
				this.store = {};
				this.state = { store: this.store };
			}
			render() {
				const { foo } = this.store;
				return <div>{foo}</div>;
			}
		}

		class Wrapper extends Component {
			constructor() {
				super();
				this.state = { val: 'foo' };
			}
			updateState() {
				this.setState({ val: 'bar' });
			}
			render() {
				return <TestComponent foo={ this.state.val } />;
			}
		}

		const wrapperInstance = ReactTestUtils.renderIntoDocument( <Wrapper /> );
		const testInstance = ReactTestUtils.findRenderedComponentWithType(wrapperInstance, TestComponent);
		assert.equal(testInstance.store.foo, 'foo');
		wrapperInstance.updateState();
		assert.equal(testInstance.store.foo, 'bar');
	});
});
