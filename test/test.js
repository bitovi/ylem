import './connect';
import './component';
import './create-component';
import './with-can-define';
import './nested-render-observe-array-bug';

import QUnit from 'steal-qunit';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTestUtils from 'react-dom/test-utils';
import { supportsFunctionName } from './utils';

import ylem, { ObserveObject } from 'ylem';

QUnit.module('@yelm', () => {

	QUnit.test('decorating a React Component makes it an Ylem ObserverComponent', (assert) => {
		class ViewModel extends ObserveObject {
			foo = 'foo'
		}

		let instance;

		@ylem
		class MyComponent extends Component {
			static propTypes = {
				bar: PropTypes.string.isRequired,
			}

			constructor() {
				super();
				this.store = instance = new ViewModel();
			}

			render() {
				const { foo } = this.store;
				return <div>{foo}{this.props.bar}</div>;
			}
		}

		const testInstance = ReactTestUtils.renderIntoDocument(<MyComponent bar="bar" />);
		const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag(testInstance, 'div');

		assert.equal(divComponent.innerText, 'foobar', 'rendered component has the correct contents');

		instance.foo = 'NEWVALUE';
		assert.equal(divComponent.innerText, 'NEWVALUEbar', 'component rerenders with new value when changed');
	});

	QUnit.test('calling ylem() on a function makes an ObserverComponent', (assert) => {
		class Observable extends ObserveObject {
			foo = 'foo'
		}
		const instance = new Observable();

		function MyComponent(props) {
			const { foo } = instance;
			return <div>{foo}{props.bar}</div>;
		}

		MyComponent.propTypes = {
			bar: PropTypes.string.isRequired,
		};

		const TestComponent = ylem(MyComponent);

		const testInstance = ReactTestUtils.renderIntoDocument(<TestComponent bar="bar" />);
		const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag(testInstance, 'div');

		assert.equal(divComponent.innerText, 'foobar', 'rendered component has the correct contents');

		instance.foo = 'NEWVALUE';
		assert.equal(divComponent.innerText, 'NEWVALUEbar', 'component rerenders with new value when changed');
	});

	QUnit.test('The ObserverComponent returned from `ylem` should be named according to React HoC conventions', (assert) => {
		// https://reactjs.org/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging
		@ylem
		class TestComponent extends Component {}
		if (process.env.NODE_ENV !== 'test-prod') {
			supportsFunctionName && assert.equal(TestComponent.name, 'YlemObserved(TestComponent)', 'returned component is properly named');
		}

		function TestFunctionComponent() {
			return null;
		}
		const ObserverComponent = ylem(TestFunctionComponent);
		if (process.env.NODE_ENV !== 'test-prod') {
			supportsFunctionName && assert.equal(ObserverComponent.name, 'YlemObserved(TestFunctionComponent)', 'returned component is properly named');
		}

		if (process.env.NODE_ENV === 'test-prod') {
			assert.expect(0);
		}
	});

	QUnit.test('ObserverComponent should stop observing when it unmounts', (assert) => {
		class Observable extends ObserveObject {
			showChild = true
		}
		let instance;

		@ylem
		class ParentComponent extends Component {
			constructor() {
				super();
				this.store = instance = new Observable();
			}

			render() {
				const { showChild } = this.store;
				return <div>{ showChild ? <ChildComponent /> : <span /> }</div>;
			}
		}
		class ChildObservable extends ObserveObject {
			prop = 'foo';
		}
		const childInstance = new ChildObservable();

		@ylem
		class ChildComponent extends Component {
			render() {
				return <p>I AM CHILD {childInstance.prop}</p>;
			}
		}

		const testInstance = ReactTestUtils.renderIntoDocument(<ParentComponent />);
		let pComponent = ReactTestUtils.findRenderedDOMComponentWithTag(testInstance, 'p');
		assert.ok(pComponent, 'there is a p tag');

		instance.showChild = false;

		try {
			pComponent = ReactTestUtils.findRenderedDOMComponentWithTag(testInstance, 'p');
			assert.ok(false, 'there is a p tag but there should not be');
		}
		catch (e) {
			assert.ok(true, 'was unable to find a `p` within DOM');
		}

		/*eslint no-console: 0 */
		const oldError = console.error;
		console.error = function(error) {
			throw Error(error);
		};
		try {
			childInstance.prop = 'CHANGE SOMETHING ON CHILD';
		}
		catch (e) {
			assert.ok(false, 'error was thrown, child component was not properly unmounted');
		}
		console.error = oldError;

		const spanComponent = ReactTestUtils.findRenderedDOMComponentWithTag(testInstance, 'span');
		assert.ok(spanComponent, 'span inserted');
	});

	QUnit.test('Component should still work with getDerivedStateFromProps()', (assert) => {
		class ViewModel extends ObserveObject {
			bar = 'test'
		}

		@ylem
		class MyComponent extends Component {
			constructor() {
				super();
				this.store = new ViewModel();
				this.state = { store: this.store }; // eslint-disable-line react/no-unused-state
			}

			static getDerivedStateFromProps(props, state) {
				Object.assign(state.store, props);
				return null;
			}

			render() {
				const { foo, bar } = this.store;
				return <div>{bar} {foo}</div>;
			}
		}

		class WrappingComponent extends Component {
			constructor() {
				super();

				this.state = {
					foo: 'Initial Prop Value',
				};
			}

			changeState() {
				this.setState({ foo: 'New Prop Value' });
			}

			render() {
				return <MyComponent foo={this.state.foo} />;
			}
		}

		const wrappingInstance = ReactTestUtils.renderIntoDocument(<WrappingComponent />);
		const testInstance = ReactTestUtils.scryRenderedComponentsWithType(wrappingInstance, MyComponent)[0];
		const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag(testInstance, 'div');

		assert.equal(testInstance.props.foo, 'Initial Prop Value');
		assert.equal(divComponent.innerText, 'test Initial Prop Value');
		wrappingInstance.changeState();
		assert.equal(testInstance.props.foo, 'New Prop Value');
		assert.equal(divComponent.innerText, 'test New Prop Value');
	});

	QUnit.test('Component should still work with componentWillReceiveProps()', (assert) => {
		class ViewModel extends ObserveObject {
			bar = 'test'
		}

		@ylem
		class MyComponent extends Component {

			constructor(props) {
				super(props);
				this.store = new ViewModel(props);
			}

			UNSAFE_componentWillReceiveProps({ foo }) {
				this.store.foo = foo;
			}

			render() {
				const { foo, bar } = this.store;
				return <div>{bar} {foo}</div>;
			}
		}

		class WrappingComponent extends Component {
			constructor() {
				super();

				this.state = {
					foo: 'Initial Prop Value',
				};
			}

			changeState() {
				this.setState({ foo: 'New Prop Value' });
			}

			render() {
				return <MyComponent foo={this.state.foo} />;
			}
		}

		const wrappingInstance = ReactTestUtils.renderIntoDocument(<WrappingComponent />);
		const testInstance = ReactTestUtils.scryRenderedComponentsWithType(wrappingInstance, MyComponent)[0];
		const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag(testInstance, 'div');

		assert.equal(testInstance.props.foo, 'Initial Prop Value');
		assert.equal(divComponent.innerText, 'test Initial Prop Value');
		wrappingInstance.changeState();
		assert.equal(testInstance.props.foo, 'New Prop Value');
		assert.equal(divComponent.innerText, 'test New Prop Value');
	});
});
