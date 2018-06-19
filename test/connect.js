import QUnit from 'steal-qunit';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTestUtils from 'react-dom/test-utils';
import { connect, ObserveObject } from 'ylem';
import { getTextFromElement, supportsFunctionName } from './utils';

QUnit.module('@connect with ObserveObject', () => {

	class EmptyViewModel extends ObserveObject {}

	QUnit.test('basic rendering', (assert) => {

		class ViewModel extends ObserveObject {
			static propTypes = {
				bar: PropTypes.string.isRequired,
			}

			constructor(props) {
				super(props);

				assert.deepEqual(props, undefined, 'constructor is called with the correct props');

				this.foo = 'foo';
			}
		}

		class MyComponent extends Component {
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

			UNSAFE_componentWillMount() {
				assert.ok(this.props instanceof ViewModel, 'props is an instance of ViewModel');
			}

			render() {
				assert.ok(this.props instanceof ViewModel, 'props is an instance of ViewModel');

				const { foo, bar } = this.props;
				return <div>{foo}{bar}</div>;
			}
		}

		const TestComponent = connect(ViewModel)(MyComponent);

		if (process.env.NODE_ENV !== 'test-prod') {
			assert.equal(TestComponent.propTypes, ViewModel.propTypes, 'connected component has the correct propTypes');
		}

		const testInstance = ReactTestUtils.renderIntoDocument( <TestComponent bar="bar" /> );
		const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'div' );

		assert.equal(divComponent.innerText, 'foobar', 'rendered component has the correct contents');

	});

	QUnit.test('should update whenever any observable property on the observable instance changes', (assert) => {

		class ViewModel extends ObserveObject {
			constructor(props) {
				super(props);
				this.test = 'test';
			}
		}

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

	QUnit.test('should update whenever any observable property on the observable instance changes (nested)', (assert) => {

		class InnerViewModel extends ObserveObject {
			constructor(props) {
				super(props);

				this.test = 'test';
			}
		}

		@connect(InnerViewModel)
		class InnerComponent extends Component {
			static propTypes = {
				bar: PropTypes.shape({
					bam: PropTypes.shape({
						quux: PropTypes.string.isRequired,
					}).isRequired,
				}).isRequired,
				test: PropTypes.string.isRequired,
			}

			render() {
				const { test, bar } = this.props;
				return <div>{test} {bar.bam.quux}</div>;
			}
		}

		class OuterViewModel extends ObserveObject {
			constructor(props) {
				super(props);
			}
		}

		@connect(OuterViewModel)
		class OuterComponent extends Component {
			static propTypes = {
				foo: PropTypes.shape({
					bar: PropTypes.shape({
						bam: PropTypes.shape({
							quux: PropTypes.string.isRequired,
						}).isRequired,
					}).isRequired
				}).isRequired,
			}

			render() {
				const { foo } = this.props;
				return <InnerComponent bar={foo.bar} />;
			}
		}

		const testInstance = ReactTestUtils.renderIntoDocument( <OuterComponent foo={{ bar: { bam: { quux: 'hello' } } }} /> );
		const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'div' );

		assert.equal(divComponent.innerText, 'test hello');
		testInstance.observable.foo.bar.bam.quux = 'world';
		assert.equal(divComponent.innerText, 'test world');

	});

	QUnit.test('should update the observable when new props are received', (assert) => {
		class ViewModel extends ObserveObject {
			constructor(props) {
				super(props);
				this.test = 'test';
			}
		}

		@connect(ViewModel)
		class TestComponent extends Component {
			static propTypes = {
				foo: PropTypes.string.isRequired,
				test: PropTypes.string.isRequired,
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

	QUnit.test('rendering with Component and transformed props', (assert) => {
		class ViewModel extends ObserveObject {
			foo = 'foo'
		}

		@connect(ViewModel, { mapProps: props => ({ props }) })
		class TestComponent extends Component {
			static propTypes = {
				foo: PropTypes.string.isRequired,
				props: PropTypes.shape({
					bar: PropTypes.string.isRequired,
				}).isRequired,
			}

			render() {
				const { foo, props: { bar } } = this.props;
				return <div>{foo}{bar}</div>;
			}
		}

		if (process.env.NODE_ENV !== 'test-prod') {
			supportsFunctionName && assert.equal(TestComponent.name, 'YlemConnected(TestComponent)', 'returned component is properly named');
		}

		const testInstance = ReactTestUtils.renderIntoDocument( <TestComponent bar="bar" /> );
		const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'div' );

		assert.equal(divComponent.innerText, 'foobar', 'rendered component has the correct contents');
	});

	QUnit.test('rendering with Function and transformed props', (assert) => {
		class ViewModel extends ObserveObject {
			foo = 'foo'
		}

		function TestComponent(props) {
			const { foo, props: { bar } } = props;
			return <div>{foo}{bar}</div>;
		}

		TestComponent.propTypes = {
			foo: PropTypes.string.isRequired,
			props: PropTypes.shape({
				bar: PropTypes.string.isRequired,
			}).isRequired,
		};

		const ConnectedTestComponent = connect(ViewModel, { mapProps: props => ({ props }) })(TestComponent);

		if (process.env.NODE_ENV !== 'test-prod') {
			supportsFunctionName && assert.equal(ConnectedTestComponent.name, 'YlemConnected(TestComponent)', 'returned component is properly named');
		}

		const testInstance = ReactTestUtils.renderIntoDocument( <ConnectedTestComponent bar="bar" /> );
		const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'div' );

		assert.equal(divComponent.innerText, 'foobar', 'rendered component has the correct contents');
	});

	QUnit.skip('should update parent before child', (assert) => {
		// var expected = [ 'parent', 'child1', 'child2', 'parent', 'child1', 'child2' ];
		var expected = [ 'parent', 'child1', 'child2', 'parent', 'parent', 'child1', 'parent', 'child2' ];

		@connect(EmptyViewModel)
		class ChildComponent1 extends Component {
			static propTypes = {
				name: PropTypes.shape({
					first: PropTypes.string.isRequired,
				}).isRequired,
			}

			render() {
				assert.equal('child1', expected.shift(), 'child1 renderer called in the right order');

				const { name } = this.props;
				return <div>{name.first}</div>;
			}
		}

		@connect(EmptyViewModel)
		class ChildComponent2 extends Component {
			static propTypes = {
				name: PropTypes.shape({
					first: PropTypes.string.isRequired,
				}).isRequired,
			}

			render() {
				assert.equal('child2', expected.shift(), 'child2 renderer called in the right order');

				const { name } = this.props;
				return <div>{name.first}</div>;
			}
		}

		@connect(EmptyViewModel)
		class ParentComponent extends Component {
			static propTypes = {
				name: PropTypes.shape({
					first: PropTypes.string.isRequired,
				}).isRequired,
			}

			render() {
				assert.equal('parent', expected.shift(), 'parent renderer called in the right order');

				const { name } = this.props;
				return (
					<div>
						{name.first}
						<ChildComponent1 name={name} />
						<ChildComponent2 name={name} />
					</div>
				);
			}
		}

		const observable = ReactTestUtils.renderIntoDocument( <ParentComponent name={{ first: 'Yetti' }} /> ).observable;
		observable.name.first = 'Christopher';

		assert.equal(expected.length, 0, 'all expectations were run');
	});

	QUnit.test('should change props on the correct children - deep tree', (assert) => {

		var render = (props) => {
			return <span>{props.value}{props.children}</span>;
		};

		var Child0 = connect(EmptyViewModel)(render);
		var Child00 = connect(EmptyViewModel)(render);
		var Child000 = connect(EmptyViewModel)(render);
		var Child01 = connect(EmptyViewModel)(render);
		var Child1 = connect(EmptyViewModel)(render);
		var Child10 = connect(EmptyViewModel)(render);
		var Child100 = connect(EmptyViewModel)(render);
		var Child1000 = connect(EmptyViewModel)(render);
		var Child11 = connect(EmptyViewModel)(render);

		var Parent = connect(EmptyViewModel)((props) => {
			return (
				<div>
					<Child0 value="0">
						<Child00 value="1">
							{props.prop0}
							<Child000 value="2" />
						</Child00>
						<Child01 value="3" />
					</Child0>
					{props.prop1}
					<Child1 value="4">
						{props.prop2}
						<Child10 value="5">
							<Child100 value="6">
								<Child1000 value="7" />
							</Child100>
						</Child10>
						<Child11 value="8" />
					</Child1>
				</div>
			);
		});

		const parentInstance = ReactTestUtils.renderIntoDocument( <Parent prop0="!" prop1="@" prop2="#" /> );
		const parentViewModel = parentInstance.observable;
		const parentDiv = ReactTestUtils.findRenderedDOMComponentWithTag( parentInstance, 'div' );

		const child0ViewModel = ReactTestUtils.findRenderedComponentWithType( parentInstance, Child0 ).observable;
		const child00ViewModel = ReactTestUtils.findRenderedComponentWithType( parentInstance, Child00 ).observable;
		const child000ViewModel = ReactTestUtils.findRenderedComponentWithType( parentInstance, Child000 ).observable;
		const child01ViewModel = ReactTestUtils.findRenderedComponentWithType( parentInstance, Child01 ).observable;
		const child1ViewModel = ReactTestUtils.findRenderedComponentWithType( parentInstance, Child1 ).observable;
		const child10ViewModel = ReactTestUtils.findRenderedComponentWithType( parentInstance, Child10 ).observable;
		const child100ViewModel = ReactTestUtils.findRenderedComponentWithType( parentInstance, Child100 ).observable;
		const child1000ViewModel = ReactTestUtils.findRenderedComponentWithType( parentInstance, Child1000 ).observable;
		const child11ViewModel = ReactTestUtils.findRenderedComponentWithType( parentInstance, Child11 ).observable;

		assert.equal(getTextFromElement(parentDiv), '01!23@4#5678', '01!23@4#5678');
		child0ViewModel.value = 'a';
		assert.equal(getTextFromElement(parentDiv), 'a1!23@4#5678', 'a1!23@4#5678');
		child00ViewModel.value = 'b';
		assert.equal(getTextFromElement(parentDiv), 'ab!23@4#5678', 'ab!23@4#5678');
		child000ViewModel.value = 'c';
		assert.equal(getTextFromElement(parentDiv), 'ab!c3@4#5678', 'ab!c3@4#5678');
		child01ViewModel.value = 'd';
		assert.equal(getTextFromElement(parentDiv), 'ab!cd@4#5678', 'ab!cd@4#5678');
		child1ViewModel.value = 'e';
		assert.equal(getTextFromElement(parentDiv), 'ab!cd@e#5678', 'ab!cd@e#5678');
		child10ViewModel.value = 'f';
		assert.equal(getTextFromElement(parentDiv), 'ab!cd@e#f678', 'ab!cd@e#f678');
		child100ViewModel.value = 'g';
		assert.equal(getTextFromElement(parentDiv), 'ab!cd@e#fg78', 'ab!cd@e#fg78');
		child1000ViewModel.value = 'h';
		assert.equal(getTextFromElement(parentDiv), 'ab!cd@e#fgh8', 'ab!cd@e#fgh8');
		child11ViewModel.value = 'i';
		assert.equal(getTextFromElement(parentDiv), 'ab!cd@e#fghi', 'ab!cd@e#fghi');

		// Note: because parent re-rendered, child props overwrite change values in observable instance

		parentViewModel.prop0 = 'A';
		assert.equal(getTextFromElement(parentDiv), '01A23@4#5678', '01A23@4#5678');
		parentViewModel.prop1 = 'B';
		assert.equal(getTextFromElement(parentDiv), '01A23B4#5678', '01A23B4#5678');
		parentViewModel.prop2 = 'C';
		assert.equal(getTextFromElement(parentDiv), '01A23B4C5678', '01A23B4C5678');

	});
});
