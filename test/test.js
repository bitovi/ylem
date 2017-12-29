import QUnit from 'steal-qunit';
import React /*, { Component as ReactComponent } */ from 'react';
import ReactTestUtils from 'react-dom/test-utils';


import reactViewModel from 'react-view-model';
import Component from 'react-view-model/component';
import { getTextFromElement, supportsFunctionName } from './utils';

import './test-define';

QUnit.module('react-view-model', () => {

	QUnit.module('when extending Component', () => {

		QUnit.test('should work without a ViewModel', (assert) => {

			class TestComponent extends Component {
				render() {
					return <div>{this.viewModel.foobar}</div>;
				}
			}

			const testInstance = ReactTestUtils.renderIntoDocument( <TestComponent foobar="foobar" /> );
			const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'div' );

			assert.equal(divComponent.innerText, 'foobar');

		});

	});

	QUnit.module('when using reactViewModel', () => {

		QUnit.test('should change props on the correct child', (assert) => {
			var Child0 = reactViewModel('Child0', (props) => {
				return <div>{ props.val }</div>;
			});
			var Child1 = reactViewModel('Child1', () => {
				return <div>child1</div>;
			});
			var Parent = reactViewModel('Parent', () => {
				return <div><Child0 val="foo" /><Child1 /></div>;
			});

			const testInstance = ReactTestUtils.renderIntoDocument( <Parent /> );
			const child0Instance = ReactTestUtils.findRenderedComponentWithType( testInstance, Child0 );
			const child0Div = ReactTestUtils.findRenderedDOMComponentWithTag( child0Instance, 'div' );
			child0Instance.viewModel.val = 'bar';
			assert.equal(getTextFromElement(child0Div), 'bar');
		});

		QUnit.test('should work with displayName and render function', (assert) => {
			var Person = reactViewModel('Person', (props) => {
				return <div>{ props.first } { props.last }</div>;
			});

			const testInstance = ReactTestUtils.renderIntoDocument( <Person first="Christopher" last="Baker" /> );
			const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'div' );

			assert.ok(Person.prototype instanceof Component, 'returned component is an instance of Component');
			supportsFunctionName && assert.equal(Person.name, 'Person', 'returned component is properly named');
			assert.equal(getTextFromElement(divComponent), 'Christopher Baker');
			testInstance.viewModel.first = 'Yetti';
			assert.equal(getTextFromElement(divComponent), 'Yetti Baker');
		});


		QUnit.test('should work with render function', (assert) => {
			var Person = reactViewModel((props) => {
				return <div>{ props.first } { props.last }</div>;
			});

			const testInstance = ReactTestUtils.renderIntoDocument( <Person first="Christopher" last="Baker" /> );
			const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'div' );

			assert.ok(Person.prototype instanceof Component, 'returned component is an instance of Component');
			supportsFunctionName && assert.equal(Person.name, 'ReactVMComponentWrapper', 'returned component is properly named');
			assert.equal(getTextFromElement(divComponent), 'Christopher Baker');
			testInstance.viewModel.first = 'Yetti';
			assert.equal(getTextFromElement(divComponent), 'Yetti Baker');
		});


		QUnit.test('should change props on the correct children - deep tree', (assert) => {
			var render = (props) => {
				return <span>{props.value}{props.children}</span>;
			};
			var Child0 = reactViewModel('Child0', render);
			var Child00 = reactViewModel('Child00', render);
			var Child000 = reactViewModel('Child000', render);

			var Child01 = reactViewModel('Child01', render);


			var Child1 = reactViewModel('Child1', render);
			var Child10 = reactViewModel('Child10', render);
			var Child100 = reactViewModel('Child100', render);
			var Child1000 = reactViewModel('Child1000', render);
			var Child11 = reactViewModel('Child11', render);


			var Parent = reactViewModel('Parent', (props) => {
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

			parentViewModel.prop0 = 'A';
			assert.equal(getTextFromElement(parentDiv), 'abAcd@e#fghi', 'abAcd@e#fghi');
			parentViewModel.prop1 = 'B';
			assert.equal(getTextFromElement(parentDiv), 'abAcdBe#fghi', 'abAcdBe#fghi');
			parentViewModel.prop2 = 'C';
			assert.equal(getTextFromElement(parentDiv), 'abAcdBeCfghi', 'abAcdBeCfghi');

		});

		QUnit.test('should change a prop multiple times when you have nested children', (assert) => {
			var Child0 = reactViewModel('Child0', (props) => {
				return <span>{props.children}</span>;
			});
			var Child1 = reactViewModel('Child1', () => {
				return <span>z</span>;
			});


			var Parent = reactViewModel('Parent', (props) => {
				return (
					<div>
						{props.prop0}
						<Child0>
							<Child1 />
						</Child0>
					</div>
				);
			});

			const parentInstance = ReactTestUtils.renderIntoDocument( <Parent prop0="0" /> );
			const parentViewModel = parentInstance.viewModel;
			const parentDiv = ReactTestUtils.findRenderedDOMComponentWithTag( parentInstance, 'div' );

			assert.equal(getTextFromElement(parentDiv), '0z', '0z');
			parentViewModel.prop0 = 'a';
			assert.equal(getTextFromElement(parentDiv), 'az', 'az');
			parentViewModel.prop0 = 'b';
			assert.equal(getTextFromElement(parentDiv), 'bz', 'bz');

		});


	});


});
