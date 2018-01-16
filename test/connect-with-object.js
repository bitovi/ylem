import QUnit from 'steal-qunit';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTestUtils from 'react-dom/test-utils';

import { connect } from 'react-view-model';

QUnit.module('@connect with raw object', () => {

	QUnit.test('basic rendering', (assert) => {

		@connect({ foo: 'foo' })
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

		const testInstance = ReactTestUtils.renderIntoDocument( <TestComponent bar="bar" /> );
		const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'div' );

		assert.equal(divComponent.innerText, 'foobar', 'rendered component has the correct contents');

	});

	QUnit.test('should update whenever any observable property on the viewModel instance changes', (assert) => {

		@connect({ test: 'test' })
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
		testInstance.viewModel.foo = 'MMM';
		assert.equal(divComponent.innerText, 'testMMMbar');

	});

	QUnit.test('should update whenever any observable property on the viewModel instance changes (nested)', (assert) => {

		@connect({ test: 'test' })
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

		@connect({})
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
		testInstance.viewModel.foo.bar.bam.quux = 'world';
		assert.equal(divComponent.innerText, 'test world');

	});

	QUnit.test('should update the viewModel when new props are received', (assert) => {

		@connect({ test: 'test' })
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

});
