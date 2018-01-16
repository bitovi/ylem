import QUnit from 'steal-qunit';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTestUtils from 'react-dom/test-utils';

import { connect } from 'react-view-model';

QUnit.module('@connect with raw function', () => {

	QUnit.test('basic rendering', (assert) => {

		@connect((props) => {
			assert.deepEqual(props, { bar: 'bar' }, 'function is called with the correct props');

			return {
				...props,
				foo: 'foo',
			};
		})
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

		@connect((props) => ({ ...props }))
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

		const testInstance = ReactTestUtils.renderIntoDocument( <TestComponent foo="foo" bar="bar" /> );
		const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'div' );

		assert.equal(divComponent.innerText, 'foobar');
		testInstance.viewModel.foo = 'MMM';
		assert.equal(divComponent.innerText, 'MMMbar');

	});

	QUnit.test('should update whenever any observable property on the viewModel instance changes (nested)', (assert) => {

		@connect((props) => ({ ...props }))
		class InnerComponent extends Component {
			static propTypes = {
				bar: PropTypes.shape({
					bam: PropTypes.shape({
						quux: PropTypes.string.isRequired,
					}).isRequired,
				}).isRequired
			}

			render() {
				const { bar } = this.props;
				return <div>{bar.bam.quux}</div>;
			}
		}

		@connect((props) => ({ ...props }))
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

		assert.equal(divComponent.innerText, 'hello');
		testInstance.viewModel.foo.bar.bam.quux = 'world';
		assert.equal(divComponent.innerText, 'world');

	});

	QUnit.test('should update the viewModel when new props are received', (assert) => {

		@connect((props) => ({ ...props }))
		class TestComponent extends Component {
			static propTypes = {
				foo: PropTypes.string.isRequired,
			}

			render() {
				const { foo } = this.props;
				return <div>{foo}</div>;
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
		assert.equal(divComponent.innerText, 'Initial Prop Value');
		wrappingInstance.changeState();
		assert.equal(testInstance.props.foo, 'New Prop Value');
		assert.equal(divComponent.innerText, 'New Prop Value');

	});

});
