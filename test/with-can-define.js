import QUnit from 'steal-qunit';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTestUtils from 'react-dom/test-utils';
import DefineMap from 'can-define/map/map';
import ylem, { connect } from 'ylem';

QUnit.module('ylem with can-define', () => {

	QUnit.test('decorating a React Component makes it an Ylem ObserverComponent', (assert) => {
		const ViewModel = DefineMap.extend('ViewModel', {
			foo: {
				type: 'string',
				default: 'foo'
			}
		});

		let instance;

		@ylem
		class MyComponent extends Component {
			constructor() {
				super();
				this.store = instance = new ViewModel();
			}
			static propTypes = {
				bar: PropTypes.string.isRequired,
			}

			render() {
				const { foo } = this.store;
				return <div>{foo}{this.props.bar}</div>;
			}
		}

		const testInstance = ReactTestUtils.renderIntoDocument( <MyComponent bar="bar" /> );
		const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'div' );

		assert.equal(divComponent.innerText, 'foobar', 'rendered component has the correct contents');

		instance.foo = 'NEWVALUE';
		assert.equal(divComponent.innerText, 'NEWVALUEbar', 'component rerenders with new value when changed');
	});

	QUnit.test('calling ylem() on a function makes an ObserverComponent', (assert) => {
		const Observable = DefineMap.extend('Observable', {
			foo: {
				type: 'string',
				default: 'foo'
			}
		});
		const instance = new Observable();

		function MyComponent(props) {
			const { foo } = instance;
			return <div>{foo}{props.bar}</div>;
		}

		MyComponent.propTypes = {
			bar: PropTypes.string.isRequired,
		};

		const TestComponent = ylem(MyComponent);

		const testInstance = ReactTestUtils.renderIntoDocument( <TestComponent bar="bar" /> );
		const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'div' );

		assert.equal(divComponent.innerText, 'foobar', 'rendered component has the correct contents');

		instance.foo = 'NEWVALUE';
		assert.equal(divComponent.innerText, 'NEWVALUEbar', 'component rerenders with new value when changed');
	});

	QUnit.test('ObserverComponent should stop observing when it unmounts', (assert) => {
		const Observable = DefineMap.extend('Observable', {
			showChild: {
				type: 'boolean',
				default: true
			}
		});
		let instance;

		@ylem
		class ParentComponent extends Component {
			constructor() {
				super();
				this.store = instance = new Observable();
			}

			render() {
				const { showChild } = this.store;
				return <div>{ showChild ? <ChildComponent/> : <span/> }</div>;
			}
		}
		const ChildObservable = DefineMap.extend('ChildObservable', {
			prop: {
				type: 'string',
				default: 'foo'
			}
		});
		let childInstance = new ChildObservable();

		@ylem
		class ChildComponent extends Component {
			render() {
				return <p>I AM CHILD {childInstance.prop}</p>;
			}
		}

		const testInstance = ReactTestUtils.renderIntoDocument( <ParentComponent/> );
		var pComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'p' );
		assert.ok(pComponent, 'there is a p tag');

		instance.showChild = false;

		try {
			pComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'p' );
			assert.ok(false, 'there is a p tag but there should not be');
		} catch (e) {
			assert.ok(true, 'was unable to find a `p` within DOM');
		}

		/*eslint no-console: 0 */
		const oldError = console.error;
		console.error = function(error){ throw Error(error); };
		try {
			childInstance.prop = 'CHANGE SOMETHING ON CHILD';
		} catch (e) {
			assert.ok(false, 'error was thrown, child component was not properly unmounted');
		}
		console.error = oldError;

		var spanComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'span' );
		assert.ok(spanComponent, 'span inserted');
	});

	QUnit.module('@connect', () => {

		QUnit.test('basic rendering', (assert) => {

			const ViewModel = DefineMap.extend('ViewModel', {
				init(props) {
					assert.deepEqual(props, undefined, 'constructor is called with the correct props');
				},

				foo: {
					default: 'foo',
				},
				bar: 'string',
			});

			@connect(ViewModel)
			class TestComponent extends Component {
				static propTypes = {
					foo: PropTypes.string.isRequired,
					bar: PropTypes.string.isRequired,
				}

				constructor(props) {
					assert.ok(typeof props.foo !== 'undefined', 'props has foo');
					assert.ok(typeof props.bar !== 'undefined', 'props has bar');

					super(props);
					assert.ok(this.props instanceof ViewModel, 'props is an instance of ViewModel');
				}

				UNSAGE_componentWillMount() {
					assert.ok(this.props instanceof ViewModel, 'props is an instance of ViewModel');
				}

				render() {
					assert.ok(this.props instanceof ViewModel, 'props is an instance of ViewModel');

					const { foo, bar } = this.props;
					return <div>{foo}{bar}</div>;
				}
			}

			const testInstance = ReactTestUtils.renderIntoDocument( <TestComponent bar="bar" /> );
			const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'div' );

			assert.equal(divComponent.innerText, 'foobar', 'rendered component has the correct contents');

		});

		QUnit.test('should update whenever any observable property on the observable instance changes', (assert) => {

			const ViewModel = DefineMap.extend('ViewModel', {
				foo: 'string',
				bar: 'string',
				test: {
					default: 'test',
				},
			});

			@connect(ViewModel)
			class TestComponent extends Component {
				static propTypes = {
					foo: PropTypes.string.isRequired,
					bar: PropTypes.string.isRequired,
					test: PropTypes.string.isRequired,
				}

				render() {
					const { test, foo, bar } = this.props;
					return <div>{test}{foo}{bar}</div>;
				}
			}

			const testInstance = ReactTestUtils.renderIntoDocument( <TestComponent foo="foo" bar="bar" /> );
			const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'div' );

			assert.equal(divComponent.innerText, 'testfoobar');
			testInstance.observable.foo = 'MMM';
			assert.equal(divComponent.innerText, 'testMMMbar');

		});

		QUnit.test('should update the observable instance when new props are received', (assert) => {

			const ViewModel = DefineMap.extend('ViewModel', {
				foo: 'string',
				test: {
					default: 'test',
				},
			});

			@connect(ViewModel)
			class TestComponent extends Component {
				static propTypes = {
					foo: PropTypes.string.isRequired,
				}

				render() {
					const { test, foo } = this.props;
					return <div>{test} {foo}</div>;
				}
			}

			class WrappingComponent extends React.Component {
				constructor() {
					super();

					this.state = {
						foo: 'Initial Prop Value'
					};
				}

				changeState() {
					this.setState({ foo: 'New Prop Value' });
				}

				render() {
					return <TestComponent foo={this.state.foo} />;
				}
			}

			const wrappingInstance = ReactTestUtils.renderIntoDocument( <WrappingComponent /> );
			const testInstance = ReactTestUtils.scryRenderedComponentsWithType( wrappingInstance, TestComponent )[0];
			const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'div' );

			assert.equal(testInstance.props.foo, 'Initial Prop Value');
			assert.equal(divComponent.innerText, 'test Initial Prop Value');
			wrappingInstance.changeState();
			assert.equal(testInstance.props.foo, 'New Prop Value');
			assert.equal(divComponent.innerText, 'test New Prop Value');

		});
	});
});
