import QUnit from 'steal-qunit';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTestUtils from 'react-dom/test-utils';

import { Object as ObserveObject } from 'can-observe';
import { createViewModelComponent } from 'ylem';

QUnit.module('`createViewModelComponent` with can-observe', () => {

	QUnit.test('basic rendering with function child', (assert) => {
		class ViewModel extends ObserveObject {
			static propTypes = {
				bar: PropTypes.string.isRequired
			}

			constructor(props) {
				super(props);
				assert.deepEqual(props, undefined, 'constructor is called with the correct props');
				this.foo = 'foo';
			}
		}

		const ViewModelComponent = createViewModelComponent(ViewModel);

		class TestComponent extends Component {
			render() {
				return (
					<ViewModelComponent bar="bar">
						{({foo, bar}) => <div>{foo}{bar}</div>}
					</ViewModelComponent>
				);
			}
		}

		const testInstance = ReactTestUtils.renderIntoDocument(<TestComponent />);
		const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag(testInstance, 'div');

		assert.equal(divComponent.innerText, 'foobar', 'rendered component has the correct contents');
	});

	QUnit.test('basic rendering with `render` prop passed', (assert) => {
		class ViewModel extends ObserveObject {
			static propTypes = {
				bar: PropTypes.string.isRequired
			}

			constructor(props) {
				super(props);
				assert.deepEqual(props, undefined, 'constructor is called with the correct props');
				this.foo = 'foo';
			}
		}

		const ViewModelComponent = createViewModelComponent(ViewModel);

		class TestComponent extends Component {
			render() {
				return <ViewModelComponent bar="bar" render={
					({foo, bar}) => <div>{foo}{bar}</div>
				} />;
			}
		}

		const testInstance = ReactTestUtils.renderIntoDocument(<TestComponent />);
		const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag(testInstance, 'div');

		assert.equal(divComponent.innerText, 'foobar', 'rendered component has the correct contents');
	});

	QUnit.test('basic rendering with `component` prop passed', (assert) => {
		class ViewModel extends ObserveObject {
			static propTypes = {
				bar: PropTypes.string.isRequired
			}

			constructor(props) {
				super(props);
				assert.deepEqual(props, undefined, 'constructor is called with the correct props');
				this.foo = 'foo';
			}
		}

		const ViewModelComponent = createViewModelComponent(ViewModel);

		class RenderComponent extends Component {
			render() {
				const {foo, bar} = this.props;
				return <div>{foo}{bar}</div>;
			}
		}

		class TestComponent extends Component {
			render() {
				return <ViewModelComponent bar="bar" component={ RenderComponent } />;
			}
		}

		const testInstance = ReactTestUtils.renderIntoDocument(<TestComponent />);
		const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag(testInstance, 'div');

		assert.equal(divComponent.innerText, 'foobar', 'rendered component has the correct contents');
	});

	QUnit.test('should update whenever any observable property on the viewModel instance changes (nested)', (assert) => {

		const quux = new ObserveObject({
			quux: 'hello'
		});

		class InnerViewModel extends ObserveObject {
			constructor(props) {
				super(props);
				this.test = 'test';
			}
		}

		const InnerViewModelComponent = createViewModelComponent(InnerViewModel);

		class OuterViewModel extends ObserveObject {
			constructor(props) {
				super(props);
			}
		}

		const OuterViewModelComponent = createViewModelComponent(OuterViewModel);

		class TestComponent extends Component {
			render() {
				const { foo } = this.props;
				return (
					<OuterViewModelComponent foo={ foo }>
						{ ({ foo }) =>
							<InnerViewModelComponent bar={ foo.bar }>
								{ ({ test, bar }) =>
									<div>{test} {bar.bam.quux}</div>
								}
							</InnerViewModelComponent>
						}
					</OuterViewModelComponent>
				);
			}
		}

		const testInstance = ReactTestUtils.renderIntoDocument( <TestComponent foo={{ bar: { bam: quux } }} /> );
		const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'div' );

		assert.equal(divComponent.innerText, 'test hello');
		quux.quux = 'world';
		assert.equal(divComponent.innerText, 'test world');

	});

});
