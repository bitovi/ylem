import './connect-with-can-observe';
import './connect-with-can-define';
import './component';
import './create-view-model-component';

import QUnit from 'steal-qunit';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTestUtils from 'react-dom/test-utils';
import { getTextFromElement, supportsFunctionName } from './utils';

import { connect, ObserveObject } from 'ylem';

class EmptyViewModel extends ObserveObject {}

QUnit.module('@connect', () => {

	QUnit.test('rendering with Component', (assert) => {
		class ViewModel extends ObserveObject {
			foo = 'foo'
		}

		@connect(ViewModel)
		class TestComponent extends Component {
			static propTypes = {
				foo: PropTypes.string.isRequired,
				bar: PropTypes.string.isRequired,
			}

			render() {
				const { foo, bar } = this.props;
				return <div>{foo}{bar}</div>;
			}
		}

		supportsFunctionName && assert.equal(TestComponent.name, 'TestComponent~ylem', 'returned component is properly named');

		const testInstance = ReactTestUtils.renderIntoDocument( <TestComponent bar="bar" /> );
		const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'div' );

		assert.equal(divComponent.innerText, 'foobar', 'rendered component has the correct contents');
	});

	QUnit.test('rendering with Function', (assert) => {
		class ViewModel extends ObserveObject {
			foo = 'foo'
		}

		function TestComponent(props) {
			const { foo, bar } = props;
			return <div>{foo}{bar}</div>;
		}

		TestComponent.propTypes = {
			foo: PropTypes.string.isRequired,
			bar: PropTypes.string.isRequired,
		};

		const ConnectedTestComponent = connect(ViewModel)(TestComponent);

		supportsFunctionName && assert.equal(ConnectedTestComponent.name, 'TestComponent~ylem', 'returned component is properly named');

		const testInstance = ReactTestUtils.renderIntoDocument( <ConnectedTestComponent bar="bar" /> );
		const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'div' );

		assert.equal(divComponent.innerText, 'foobar', 'rendered component has the correct contents');
	});

	QUnit.test('rendering with Component and transformed props', (assert) => {
		class ViewModel extends ObserveObject {
			foo = 'foo'
		}

		@connect(ViewModel, props => ({ props }))
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

		supportsFunctionName && assert.equal(TestComponent.name, 'TestComponent~ylem', 'returned component is properly named');

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

		const ConnectedTestComponent = connect(ViewModel, props => ({ props }))(TestComponent);

		supportsFunctionName && assert.equal(ConnectedTestComponent.name, 'TestComponent~ylem', 'returned component is properly named');

		const testInstance = ReactTestUtils.renderIntoDocument( <ConnectedTestComponent bar="bar" /> );
		const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'div' );

		assert.equal(divComponent.innerText, 'foobar', 'rendered component has the correct contents');
	});

	QUnit.test('should update parent before child', (assert) => {
		@connect(EmptyViewModel)
		class GrandChild1 extends Component {
			render() {
				const { name } = this.props;
				return <div>{name.first}</div>;
			}
		}

		@connect(EmptyViewModel)
		class GrandChild2 extends Component {
			render() {
				return <div>Hello fellow {this.props.name.last}. This should not re-render.</div>;
			}
		}

		@connect(EmptyViewModel)
		class ChildComponent1 extends Component {
			render() {
				const { name } = this.props;
				return <div>
					{name.first}
					<GrandChild1 name={name} />
				</div>;
			}
		}

		@connect(EmptyViewModel)
		class ChildComponent2 extends Component {
			render() {
				const { name } = this.props;
				return <div>
					{name.first}
					<GrandChild2 name={name} />
				</div>;
			}
		}

		@connect(EmptyViewModel)
		class ParentComponent extends Component {
			render() {
				const { name } = this.props;
				return (
					<div>
						{name && name.first}
						{name ?
							<ChildComponent1 name={name} />
							: null}
						{name ?
							<ChildComponent2 name={name} />
							: null}
					</div>
				);
			}
		}

		let renderCount = 0;
		[ParentComponent, ChildComponent1, ChildComponent2, GrandChild1, GrandChild2].forEach(Comp => {
			const oldRender = Comp.prototype.render;
			Comp.prototype.render = function() {
				renderCount++;
				return oldRender.call(this);
			};
		});

		const testInstance = ReactTestUtils.renderIntoDocument( <ParentComponent name={{ first: 'Yetti', last: 'Snowman' }} /> );
		const divComponent = ReactTestUtils.scryRenderedDOMComponentsWithTag( testInstance, 'div' );
		const viewModel = testInstance.viewModel;

		// the first divComponent will contain all elements
		assert.ok(divComponent[0].innerHTML.indexOf('Yetti') > -1, 'found sasquach');
		assert.equal(renderCount, 5, 'every component rendered initially');
		viewModel.name = null;
		assert.ok(divComponent[0].innerHTML.indexOf('Yetti') === -1, 'but now it is gone again');
		assert.equal(renderCount, 6, 'only the parent component rendered the second time');
	});

	QUnit.test('should unmount properly', (assert) => {
		class ViewModel extends ObserveObject {
			showChild = true
		}

		@connect(ViewModel)
		class ParentComponent extends Component {
			static propTypes = {
				showChild: PropTypes.bool.isRequired,
			}

			render() {
				const { showChild } = this.props;
				return <div>{ showChild ? <ChildComponent/> : <span/> }</div>;
			}
		}

		@connect(EmptyViewModel)
		class ChildComponent extends Component {
			render() {
				return <p>I AM CHILD</p>;
			}
		}

		const testInstance = ReactTestUtils.renderIntoDocument( <ParentComponent/> );
		var pComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'p' );

		testInstance.viewModel.showChild = false;

		try {
			pComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'p' );
			assert.ok(!pComponent, 'there is no p anymore');
		} catch (e) {
			assert.ok(true, 'was unable to find a `p` within DOM');
		}

		var spanComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'span' );
		assert.ok(spanComponent, 'span inserted');
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
		const parentViewModel = parentInstance.viewModel;
		const parentDiv = ReactTestUtils.findRenderedDOMComponentWithTag( parentInstance, 'div' );

		const child0ViewModel = ReactTestUtils.findRenderedComponentWithType( parentInstance, Child0 ).viewModel;
		const child00ViewModel = ReactTestUtils.findRenderedComponentWithType( parentInstance, Child00 ).viewModel;
		const child000ViewModel = ReactTestUtils.findRenderedComponentWithType( parentInstance, Child000 ).viewModel;
		const child01ViewModel = ReactTestUtils.findRenderedComponentWithType( parentInstance, Child01 ).viewModel;
		const child1ViewModel = ReactTestUtils.findRenderedComponentWithType( parentInstance, Child1 ).viewModel;
		const child10ViewModel = ReactTestUtils.findRenderedComponentWithType( parentInstance, Child10 ).viewModel;
		const child100ViewModel = ReactTestUtils.findRenderedComponentWithType( parentInstance, Child100 ).viewModel;
		const child1000ViewModel = ReactTestUtils.findRenderedComponentWithType( parentInstance, Child1000 ).viewModel;
		const child11ViewModel = ReactTestUtils.findRenderedComponentWithType( parentInstance, Child11 ).viewModel;

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

		// Note: because parent re-rendered, child props overwrite change values in viewModel

		parentViewModel.prop0 = 'A';
		assert.equal(getTextFromElement(parentDiv), '01A23@4#5678', '01A23@4#5678');
		parentViewModel.prop1 = 'B';
		assert.equal(getTextFromElement(parentDiv), '01A23B4#5678', '01A23B4#5678');
		parentViewModel.prop2 = 'C';
		assert.equal(getTextFromElement(parentDiv), '01A23B4C5678', '01A23B4C5678');

	});

});
