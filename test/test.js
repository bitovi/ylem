import QUnit from 'steal-qunit';
import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import DefineMap from 'can-define/map/map';

import CanReactComponent from '../react-view-models';

QUnit.module('react-view-models', () => {

    QUnit.module('when extending CanReactComponent', () => {

      const DefinedViewModel = DefineMap.extend({
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

      QUnit.test('should assign a property to the component called `viewModel` with an instance of ViewModel as the value', (assert) => {
        class TestComponent extends CanReactComponent {
            componentWillMount() {
                super.componentWillMount();
            }

            render() {
                return <div>{this.viewModel.foobar}</div>;
            }
        }
        TestComponent.ViewModel = DefinedViewModel;

        const testInstance = ReactTestUtils.renderIntoDocument( React.createElement( TestComponent ) );
        assert.ok( testInstance.viewModel instanceof DefinedViewModel );
      });

      QUnit.test('should update whenever any observable property on the viewModel instance changes', (assert) => {
        class TestComponent extends CanReactComponent {
            render() {
                return <div>{this.viewModel.foobar}</div>;
            }
        }
        TestComponent.ViewModel = DefinedViewModel;

        const testInstance = ReactTestUtils.renderIntoDocument( React.createElement( TestComponent, { bar: 'bar', baz: 'bam' } ) );
        const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'div' );

        assert.equal(divComponent.innerText, 'foobar');
        testInstance.viewModel.foo = 'MMM';
        assert.equal(divComponent.innerText, 'MMMbar');
      });

      QUnit.test('should update the component and viewModel when new props are received', (assert) => {
        class TestComponent extends CanReactComponent {
            render() {
                return <div>{this.viewModel.foo}</div>;
            }
        }
        TestComponent.ViewModel = DefinedViewModel;

        class WrappingComponent extends React.Component {
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

        const wrappingInstance = ReactTestUtils.renderIntoDocument( React.createElement( WrappingComponent ) );
        const testInstance = ReactTestUtils.scryRenderedComponentsWithType( wrappingInstance, TestComponent )[0];
        const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'div' );

        assert.equal(testInstance.props.foo, 'Initial Prop Value');
        assert.equal(testInstance.viewModel.foo, 'Initial Prop Value');
        assert.equal(divComponent.innerText, 'Initial Prop Value');
        wrappingInstance.changeState();
        assert.equal(testInstance.props.foo, 'New Prop Value');
        assert.equal(testInstance.viewModel.foo, 'New Prop Value');
        assert.equal(divComponent.innerText, 'New Prop Value');
      });

      QUnit.test('should use the viewModels props value, if the viewModel changes, and no new props are received', (assert) => {
        class TestComponent extends CanReactComponent {
            render() {
                return <div>{this.viewModel.foobar}</div>;
            }
        }
        TestComponent.ViewModel = DefinedViewModel;

        class WrappingComponent extends React.Component {
            constructor() {
                super();

                this.state = {
                    bar: 'bar'
                };
            }

            render() {
                return <TestComponent bar={ this.state.bar } />;
            }
        }

        const wrappingInstance = ReactTestUtils.renderIntoDocument( React.createElement( WrappingComponent ) );
        const testInstance = ReactTestUtils.scryRenderedComponentsWithType(wrappingInstance, TestComponent)[0];
        const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'div' );

        assert.equal(testInstance.viewModel.foobar, 'foobar');
        assert.equal(divComponent.innerText, 'foobar');
        testInstance.viewModel.bar = 'BAZ';
        assert.equal(testInstance.viewModel.foobar, 'fooBAZ');
        assert.equal(divComponent.innerText, 'fooBAZ');
      });

      QUnit.test('should be able to have the viewModel transform props before passing to child component', (assert) => {
        class TestComponent extends CanReactComponent {
            render() {
                return <div>{this.viewModel.zzz}</div>;
            }
        }
        TestComponent.ViewModel = DefinedViewModel;

        const testInstance = ReactTestUtils.renderIntoDocument( React.createElement( TestComponent, { zzz: 'zzz' } ) );
        const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'div' );

        assert.equal(testInstance.viewModel.zzz, 'ZZZ');
        assert.equal(divComponent.innerText, 'ZZZ');
      });

      QUnit.test('should be able to call the props.interceptedCallback function received from parent component', (assert) => {
          class TestComponent extends CanReactComponent {
              render() {
                  return <div>{this.viewModel.foobar}</div>;
              }
          }
          TestComponent.ViewModel = DefinedViewModel;

          const expectedValue = [];
          class WrappingComponent extends React.Component {
              parentCallBack() {
                  return expectedValue;
              }

              render() {
                  return <TestComponent interceptedCallback={ this.parentCallBack } />;
              }
          }

          const wrappingInstance = ReactTestUtils.renderIntoDocument( React.createElement( WrappingComponent ) );
          const testInstance = ReactTestUtils.scryRenderedComponentsWithType(wrappingInstance, TestComponent)[0];

          const actual = testInstance.viewModel.interceptedCallback();

          assert.equal(actual, expectedValue, 'Value returned from wrapping components callback successfully');
          assert.equal(testInstance.viewModel.interceptedCallbackCalled, true, 'ViewModels interceptedCallback was called');
          delete testInstance.viewModel.interceptedCallbackCalled;
      });

  });

});
