import QUnit from 'steal-qunit';
import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import ReactTestUtils from 'react-dom/test-utils';
import DefineMap from 'can-define/map/map';

import reactViewModel, { Component } from 'react-view-model';

function getTextFromElement(node) {
	var txt = "";
	node = node.firstChild;
	while(node) {
		if(node.nodeType === 3) {
			txt += node.nodeValue;
		} else {
			txt += getTextFromElement(node);
		}
		node = node.nextSibling;
	}
	return txt;
}

QUnit.module('react-view-model', () => {

	QUnit.module('when extending Component', () => {

		const DefinedViewModel = DefineMap.extend('ViewModel', {
			foo: {
				type: 'string',
				value: 'foo'
			},
			bar: 'string',
			foobar: {
				get() {
					return this.foo + this.bar;
				}
			},

			zzz: {
				set( newVal ) {
					return newVal.toUpperCase();
				}
			},

			interceptedCallbackCalled: 'boolean',
			interceptedCallback: {
				type: 'function',
				get( lastSetValue ) {
					return (...args) => {
						this.interceptedCallbackCalled = true;
						if ( lastSetValue ) {
							return lastSetValue(...args);
						}
					};
				}
			}
		});

		QUnit.test('should work without a ViewModel', (assert) => {

			class TestComponent extends Component {
				render() {
					return <div>{this.props.foobar}</div>;
				}
			}

			const testInstance = ReactTestUtils.renderIntoDocument( <TestComponent foobar="foobar" /> );
			const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'div' );

			assert.equal(divComponent.innerText, 'foobar');

		});

		QUnit.test('should set props to be instance of ViewModel', (assert) => {
			class TestComponent extends Component {
				render() {
					return <div>{this.props.foobar}</div>;
				}
			}
			TestComponent.ViewModel = DefinedViewModel;

			const testInstance = ReactTestUtils.renderIntoDocument( <TestComponent /> );
			assert.ok( testInstance.props instanceof DefinedViewModel );
		});

		QUnit.test('should update whenever any observable property on the viewModel instance changes', (assert) => {
			class TestComponent extends Component {
				render() {
					return <div>{this.props.foobar}</div>;
				}
			}
			TestComponent.ViewModel = DefinedViewModel;

			const testInstance = ReactTestUtils.renderIntoDocument( <TestComponent bar="bar" baz="bam" /> );
			const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'div' );

			assert.equal(divComponent.innerText, 'foobar');
			testInstance.viewModel.foo = 'MMM';
			assert.equal(divComponent.innerText, 'MMMbar');
		});

		QUnit.test('should update whenever any observable property on the viewModel instance changes (nested)', (assert) => {
			class InnerComponent extends ReactComponent {
				render() {
					return <div>{this.props.bar.bam.quux}</div>;
				}
			}
			InnerComponent.propTypes = {
				bar: PropTypes.shape({
					bam: PropTypes.shape({
						quux: PropTypes.string.isRequired,
					}).isRequired,
				}).isRequired,
			};

			class OutterComponent extends Component {
				render() {
					return <InnerComponent bar={ this.props.foo.bar } />;
				}
			}
			OutterComponent.ViewModel = DefineMap.extend('ViewModel', {
				foo: DefineMap.extend('Foo', {
					bar: DefineMap.extend('Bar', {
						bam: DefineMap.extend('Bam', {
							quux: 'string',
						}),
					}),
				}),
			});

			const testInstance = ReactTestUtils.renderIntoDocument( <OutterComponent foo={{ bar: { bam: { quux: 'hello' } } }} /> );
			const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'div' );

			assert.equal(divComponent.innerText, 'hello');
			testInstance.viewModel.foo.bar.bam.quux = 'world';
			assert.equal(divComponent.innerText, 'world');
		});

		QUnit.test('should update the component when new props are received', (assert) => {
			class TestComponent extends Component {
				render() {
					return <div>{this.props.foo}</div>;
				}
			}
			TestComponent.ViewModel = DefinedViewModel;

			class WrappingComponent extends ReactComponent {
				constructor() {
					super();

					this.state = {
						barValue: 'Initial Prop Value'
					};
				}

				changeState() {
					this.setState({ barValue: 'New Prop Value' });
				}

				render() {
					return <TestComponent foo={ this.state.barValue } />;
				}
			}

			const wrappingInstance = ReactTestUtils.renderIntoDocument( <WrappingComponent /> );
			const testInstance = ReactTestUtils.scryRenderedComponentsWithType( wrappingInstance, TestComponent )[0];
			const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'div' );

			assert.equal(testInstance.props.foo, 'Initial Prop Value');
			assert.equal(divComponent.innerText, 'Initial Prop Value');
			wrappingInstance.changeState();
			assert.equal(testInstance.props.foo, 'New Prop Value');
			assert.equal(divComponent.innerText, 'New Prop Value');
		});

		QUnit.test('should be able to have the viewModel transform props before passing to child component', (assert) => {
			class TestComponent extends Component {
				render() {
					return <div>{this.props.zzz}</div>;
				}
			}
			TestComponent.ViewModel = DefinedViewModel;

			const testInstance = ReactTestUtils.renderIntoDocument( <TestComponent zzz="zzz" /> );
			const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'div' );

			assert.equal(testInstance.props.zzz, 'ZZZ');
			assert.equal(divComponent.innerText, 'ZZZ');
		});

		QUnit.test('should be able to call the props.interceptedCallback function received from parent component', (assert) => {
			class TestComponent extends Component {
				render() {
					return <div>{this.props.foobar}</div>;
				}
			}
			TestComponent.ViewModel = DefinedViewModel;

			const expectedValue = [];
			class WrappingComponent extends ReactComponent {
				parentCallBack() {
					return expectedValue;
				}

				render() {
					return <TestComponent interceptedCallback={ this.parentCallBack } />;
				}
			}

			const wrappingInstance = ReactTestUtils.renderIntoDocument( <WrappingComponent /> );
			const testInstance = ReactTestUtils.scryRenderedComponentsWithType(wrappingInstance, TestComponent)[0];

			const actual = testInstance.props.interceptedCallback();

			assert.equal(actual, expectedValue, 'Value returned from wrapping components callback successfully');
			assert.equal(testInstance.props.interceptedCallbackCalled, true, 'ViewModels interceptedCallback was called');
			testInstance.props.interceptedCallbackCalled = undefined;
		});

	});

	QUnit.module('when using reactViewModel', () => {

		QUnit.test('should work with displayName, ViewModel, and render function', (assert) => {
			let ViewModel = DefineMap.extend('ViewModel', {
				first: {
					type: 'string',
					value: 'Christopher'
				},
				last: 'string',
				name: {
					get() {
						return this.first + ' ' + this.last;
					}
				}
			});

			var Person = reactViewModel('Person', ViewModel, (props) => {
				return <div>{ props.name }</div>;
			});

			const testInstance = ReactTestUtils.renderIntoDocument( <Person last="Baker" /> );
			const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'div' );

			assert.ok(Person.prototype instanceof Component, 'returned component is an instance of Component');
			assert.equal(Person.name, 'Person', 'returned component is properly named');
			assert.equal(getTextFromElement(divComponent), 'Christopher Baker');
			testInstance.viewModel.first = 'Yetti';
			assert.equal(getTextFromElement(divComponent), 'Yetti Baker');
		});

		QUnit.test('should work with displayName and render function', (assert) => {
			var Person = reactViewModel('Person', (props) => {
				return <div>{ props.first } { props.last }</div>;
			});

			const testInstance = ReactTestUtils.renderIntoDocument( <Person first="Christopher" last="Baker" /> );
			const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'div' );

			assert.ok(Person.prototype instanceof Component, 'returned component is an instance of Component');
			assert.equal(Person.name, 'Person', 'returned component is properly named');
			assert.equal(getTextFromElement(divComponent), 'Christopher Baker');
			testInstance.viewModel.first = 'Yetti';
			assert.equal(getTextFromElement(divComponent), 'Yetti Baker');
		});

		QUnit.test('should work with ViewModel and render function', (assert) => {
			let ViewModel = DefineMap.extend('ViewModel', {
				first: {
					type: 'string',
					value: 'Christopher'
				},
				last: 'string',
				name: {
					get() {
						return this.first + ' ' + this.last;
					}
				}
			});

			var Person = reactViewModel(ViewModel, function Person(props) {
				return <div>{ props.name }</div>;
			});

			const testInstance = ReactTestUtils.renderIntoDocument( <Person last="Baker" /> );
			const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'div' );

			assert.ok(Person.prototype instanceof Component, 'returned component is an instance of Component');
			assert.equal(Person.name, 'PersonWrapper', 'returned component is properly named');
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
			assert.equal(Person.name, 'ReactVMComponentWrapper', 'returned component is properly named');
			assert.equal(getTextFromElement(divComponent), 'Christopher Baker');
			testInstance.viewModel.first = 'Yetti';
			assert.equal(getTextFromElement(divComponent), 'Yetti Baker');
		});

	});

	QUnit.module('when using React patterns', () => {

		QUnit.test('should work with prop spread', (assert) => {

			let ViewModel = DefineMap.extend('ViewModel', {
				title: {
					type: 'string',
					value: 'Test Page',
				},
				href: {
					get() {
						return `/${this.title.toLowerCase().replace(/[^a-z]/g, '-').replace(/--+/g, '-')}`;
					},
				},
			});

			class TestComponent extends Component {
				render() {
					let props = { target: '_blank' };
					return <a {...this.props} {...props} />;
				}
			}
			TestComponent.ViewModel = ViewModel;

			const testInstance = ReactTestUtils.renderIntoDocument( <TestComponent /> );
			const aComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'a' );

			const props = {};
			for (let { name, value } of aComponent.attributes) {
				props[name] = value;
			}

			assert.equal(props.target, '_blank');
			assert.equal(props.title, 'Test Page');
			assert.equal(props.href, '/test-page');

		});

		QUnit.test('should work with prop spread (nested)', (assert) => {

			let ViewModel = DefineMap.extend('ViewModel', {
				inner: DefineMap.extend('Inner', {
					title: {
						type: 'string',
						value: 'Test Page',
					},
					href: {
						get() {
							return `/${this.title.toLowerCase().replace(/[^a-z]/g, '-').replace(/--+/g, '-')}`;
						},
					},
				}),
			});

			class TestComponent extends Component {
				render() {
					let props = { target: '_blank' };
					return <a {...this.props.inner} {...props} />;
				}
			}
			TestComponent.ViewModel = ViewModel;

			const testInstance = ReactTestUtils.renderIntoDocument( <TestComponent inner={{}} /> );
			const aComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'a' );

			const props = {};
			for (let { name, value } of aComponent.attributes) {
				props[name] = value;
			}

			assert.equal(props.target, '_blank');
			assert.equal(props.title, 'Test Page');
			assert.equal(props.href, '/test-page');

		});

	});

});
