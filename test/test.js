import QUnit from 'steal-qunit';
import connect, { nobind, asArray } from '../react-view-models';
import React from 'react';
import compute from 'can-compute';
import ReactTestUtils from 'react-addons-test-utils';
import DefineMap from 'can-define/map/map';
import DefineList from 'can-define/list/list';

QUnit.module('react-view-models', () => {

  QUnit.module('connect()', function(hooks) {
    let TestComponent;
    let shallowRenderer;

    hooks.beforeEach(() => {
      TestComponent = React.createClass({
        render() {
          return React.createElement('div', { className: 'test' });
        }
      });
      shallowRenderer = ReactTestUtils.createRenderer();
    });

    QUnit.module('with a mapToProps function', () => {

      QUnit.test('should not (by default) render additional dom nodes that the ones from the extended Presentational Component', (assert) => {

        const ConnectedComponent = connect( () => ({ value: 'bar' }), TestComponent );

        shallowRenderer.render( React.createElement( ConnectedComponent, { value: 'foo' } ) );

        const result = shallowRenderer.getRenderOutput();

        assert.equal(result.type, TestComponent); // not ConnectedComponent
        assert.equal(result.props.value, 'bar'); // not 'foo'

      });

      QUnit.test('should update the component whenever an observable read inside the mapToProps function emits a change event', (assert) => {
        const observable = compute('Inital Value');
        const ConnectedComponent = connect( () => ({ value: observable() }), TestComponent );

        const connectedInstance = ReactTestUtils.renderIntoDocument( React.createElement( ConnectedComponent ) );
        const childComponent = ReactTestUtils.scryRenderedComponentsWithType(connectedInstance, TestComponent)[0];

        assert.equal(childComponent.props.value, 'Inital Value');
        observable('new value');
        assert.equal(childComponent.props.value, 'new value');

      });

      QUnit.test('should update the component when new props are received', (assert) => {
        const observable = compute('Inital Observable Value');
        const ConnectedComponent = connect( ({ propValue }) => ({ value: observable(), propValue }), TestComponent );
        const WrappingComponent = React.createClass({
          getInitialState() {
            return { propValue: 'Initial Prop Value' };
          },
          changeState() {
            this.setState( { propValue: 'New Prop Value' } );
          },
          render() {
            return <ConnectedComponent propValue={ this.state.propValue } />;
          }
        });

        const wrappingInstance = ReactTestUtils.renderIntoDocument( React.createElement( WrappingComponent ) );
        const childComponent = ReactTestUtils.scryRenderedComponentsWithType(wrappingInstance, TestComponent)[0];

        assert.equal(childComponent.props.propValue, 'Initial Prop Value');
        wrappingInstance.changeState();
        assert.equal(childComponent.props.propValue, 'New Prop Value');
      });

    });

    QUnit.module('with can-define constructor function (viewModel)', () => {

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
        list: {
          value: new DefineList(['one'])
        },
        returnContext() {
          return this;
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
        const ConnectedComponent = connect( DefinedViewModel, TestComponent );
        const connectedInstance = ReactTestUtils.renderIntoDocument( React.createElement( ConnectedComponent ) );
        assert.ok( connectedInstance.viewModel instanceof DefinedViewModel );
      });

      QUnit.test('should update whenever any observable property on the viewModel instance changes', (assert) => {
        const properties = {
          foobar: true
        };
        const ConnectedComponent = connect( DefinedViewModel, TestComponent, { properties } );
        const el = React.createElement( ConnectedComponent, { bar: 'bar', baz: 'bam' } );
        const connectedInstance = ReactTestUtils.renderIntoDocument( el );
        const childComponent = ReactTestUtils.scryRenderedComponentsWithType( connectedInstance, TestComponent )[0];

        assert.equal(childComponent.props.foobar, 'foobar');
        connectedInstance.viewModel.foo = 'MMM';
        assert.equal(childComponent.props.foobar, 'MMMbar');
      });

      QUnit.test('should update the component when new props are received', (assert) => {
        const properties = {
          bar: true
        };
        const ConnectedComponent = connect( DefinedViewModel, TestComponent, { properties } );
        const WrappingComponent = React.createClass({
          getInitialState() {
            return { barValue: 'Initial Prop Value' };
          },
          changeState() {
            this.setState( { barValue: 'New Prop Value' } );
          },
          render() {
            return <ConnectedComponent bar={ this.state.barValue } />;
          }
        });

        const wrappingInstance = ReactTestUtils.renderIntoDocument( React.createElement( WrappingComponent ) );
        const childComponent = ReactTestUtils.scryRenderedComponentsWithType(wrappingInstance, TestComponent)[0];

        assert.equal(childComponent.props.bar, 'Initial Prop Value');
        wrappingInstance.changeState();
        assert.equal(childComponent.props.bar, 'New Prop Value');
      });

      QUnit.test('should update the viewModel when new props are received', (assert) => {
        const properties = {
          bar: true,
          foobar: true
        };
        const ConnectedComponent = connect( DefinedViewModel, TestComponent, { properties } );
        const WrappingComponent = React.createClass({
          getInitialState() {
            return { bar: 'bar' };
          },
          changeState() {
            this.setState( { bar: 'BAZ' } );
          },
          render() {
            return <ConnectedComponent bar={ this.state.bar } />;
          }
        });

        const wrappingInstance = ReactTestUtils.renderIntoDocument( React.createElement( WrappingComponent ) );
        const childComponent = ReactTestUtils.scryRenderedComponentsWithType(wrappingInstance, ConnectedComponent)[0];

        assert.equal(childComponent.viewModel.foobar, 'foobar');
        wrappingInstance.changeState();
        assert.equal(childComponent.viewModel.foobar, 'fooBAZ');
      });

      QUnit.test('should use the viewModels props value, if the viewModel changes, and no new props are received', (assert) => {
        const properties = {
          foobar: true
        };
        const ConnectedComponent = connect( DefinedViewModel, TestComponent, { properties } );
        const WrappingComponent = React.createClass({
          getInitialState() {
            return { bar: 'bar' };
          },
          render() {
            return <ConnectedComponent bar={ this.state.bar } />;
          }
        });

        const wrappingInstance = ReactTestUtils.renderIntoDocument( React.createElement( WrappingComponent ) );
        const childComponent = ReactTestUtils.scryRenderedComponentsWithType(wrappingInstance, ConnectedComponent)[0];

        assert.equal(childComponent.viewModel.foobar, 'foobar');
        childComponent.viewModel.bar = 'BAZ';
        assert.equal(childComponent.viewModel.foobar, 'fooBAZ');
      });

      QUnit.test('should be able to call the props.interceptedCallback function received from parent component', (assert) => {
        const expectedValue = [];
        const properties = {
          interceptedCallback: true
        };
        const ConnectedComponent = connect( DefinedViewModel, TestComponent, { properties } );
        const WrappingComponent = React.createClass({
          parentCallBack() { return expectedValue; },
          render() {
            return <ConnectedComponent interceptedCallback={ this.parentCallBack } />;
          }
        });

        const wrappingInstance = ReactTestUtils.renderIntoDocument( React.createElement( WrappingComponent ) );
        const connectedInstance = ReactTestUtils.scryRenderedComponentsWithType(wrappingInstance, ConnectedComponent)[0];
        const childComponent = ReactTestUtils.scryRenderedComponentsWithType(connectedInstance, TestComponent)[0];

        const actual = childComponent.props.interceptedCallback();

        assert.equal(actual, expectedValue, 'Value returned from wrapping components callback successfully');
        assert.equal(connectedInstance.viewModel.interceptedCallbackCalled, true, 'ViewModels interceptedCallback was called');
      });

      QUnit.test('should be able to have the viewModel transform props before passing to child component', (assert) => {
        const properties = {
          zzz: true
        };
        const ConnectedComponent = connect( DefinedViewModel, TestComponent, { properties } );
        const el = React.createElement( ConnectedComponent, { zzz: 'zzz' } );
        const connectedInstance = ReactTestUtils.renderIntoDocument( el );
        const childComponent = ReactTestUtils.scryRenderedComponentsWithType( connectedInstance, TestComponent )[0];

        assert.equal(childComponent.props.zzz, 'ZZZ');
      });

      QUnit.module(`OPTIONS 'properties'`, () => {

        QUnit.test(`should pass vm 'keys' with a truthy value in the 'properties' object to the connected component`, (assert) => {
          const properties = {
            foo: false,
            bar: true
          };
          const ConnectedComponent = connect( DefinedViewModel, TestComponent, { properties } );
          const el = React.createElement( ConnectedComponent, { bar: 'bar', foo: 'foo' } );
          const connectedInstance = ReactTestUtils.renderIntoDocument( el );
          const childComponent = ReactTestUtils.scryRenderedComponentsWithType( connectedInstance, TestComponent )[0];
          assert.equal(childComponent.props.foo, undefined);
          assert.equal(childComponent.props.bar, 'bar');
        });

        QUnit.test(`should pass a props object with methods that have been bound
                    the correct context (the viewmodel) for callbacks`, (assert) => {
          const ConnectedComponent = connect( DefinedViewModel, TestComponent, { properties: { returnContext: true } } );
          const connectedInstance = ReactTestUtils.renderIntoDocument( React.createElement( ConnectedComponent ) );
          const childComponent = ReactTestUtils.scryRenderedComponentsWithType(connectedInstance, TestComponent)[0];
          assert.equal(childComponent.props.returnContext(), connectedInstance.viewModel);
        });

        QUnit.test(`should pass vm 'keys' with the *special value* 'nobind' in the
                    'properties' object to the connected component without binding
                    the method to the vm`, (assert) => {
          const ConnectedComponent = connect( DefinedViewModel, TestComponent, { properties: { returnContext: nobind } } );
          const connectedInstance = ReactTestUtils.renderIntoDocument( React.createElement( ConnectedComponent ) );
          const childComponent = ReactTestUtils.scryRenderedComponentsWithType(connectedInstance, TestComponent)[0];
          const ctx = {};
          assert.notEqual(childComponent.props.returnContext.call(ctx), connectedInstance.viewModel);
          assert.equal(childComponent.props.returnContext.call(ctx), ctx);
        });

        QUnit.test(`should pass vm 'keys' with the *special value* 'asArray' in the
                    'properties' object to the connected component after converting
                    array-like objects (like DefineLists) to an actual array`, (assert) => {
          const ConnectedComponent = connect( DefinedViewModel, TestComponent, { properties: { list: asArray } } );
          const connectedInstance = ReactTestUtils.renderIntoDocument( React.createElement( ConnectedComponent ) );
          const childComponent = ReactTestUtils.scryRenderedComponentsWithType(connectedInstance, TestComponent)[0];
          assert.equal(Object.getPrototypeOf( childComponent.props.list ), Array.prototype);
        });

      });

      QUnit.module(`OPTIONS 'deepObserve'`, () => {

        QUnit.test(`should be able to update the component, when a nested observable
                    property changes, if the 'deepObserve' options is true`, (assert) => {
          const Person = DefineMap.extend({
            name: {
              type: 'string',
              value: 'Adam'
            }
          });
          const DefinedViewModel = DefineMap.extend({
            person: {
              Value: Person
            }
          });
          const properties = {
            person: true
          };
          const Component = ({ person }) => {
            return <div className="person-div">{ person.name }</div>;
          };
          Component.propTypes = { person: React.PropTypes.any };
          const ConnectedComponent = connect( DefinedViewModel, Component, { properties, deepObserve: true } );
          const el = React.createElement( ConnectedComponent, {} );
          const connectedInstance = ReactTestUtils.renderIntoDocument( el );
          const div = ReactTestUtils.scryRenderedDOMComponentsWithTag( connectedInstance, 'div' )[0];
          assert.equal(div.textContent, 'Adam');
          connectedInstance.viewModel.person.name = 'Marshall';
          assert.equal(div.textContent, 'Marshall');
        });

      });

    });

    QUnit.module(`OPTIONS 'displayName'`, (hooks) => {
      let origDisplayName;

      hooks.beforeEach(()=>{
        origDisplayName = TestComponent.displayName;
        TestComponent.displayName = '???';
      });
      hooks.afterEach(()=>{
        TestComponent.displayName = origDisplayName;
      });

      QUnit.test(`should set the components 'displayName' for React Dev tools when set in
                  the options`, (assert) => {
        const expectedValue = 'ThisIsTheComponentName';
        const DefinedViewModel = DefineMap.extend({});
        const ConnectedComponent = connect( DefinedViewModel, TestComponent, { displayName: expectedValue } );
        assert.equal(ConnectedComponent.displayName, expectedValue);
      });

      QUnit.test(`should set the components 'displayName' to a default value wrapping
                  the child components 'displayName' in "Connected(*)" if NOT set
                  in the options`, (assert) => {
        const expectedValue = 'Connected(???)';
        const ConnectedComponent = connect( p=>p, TestComponent );
        assert.equal(ConnectedComponent.displayName, expectedValue);
      });

      QUnit.test(`should set the components 'displayName' to a default value
                  "Connected(Component)" if the child component does not have a
                  display name of function name`, (assert) => {
        const expectedStatelessValue = 'Connected(statelessComponent)';
        const statelessComponent = ()=>null;
        const ConnectedStatelessComponent = connect( p=>p, statelessComponent );
        assert.equal(ConnectedStatelessComponent.displayName, expectedStatelessValue);
        const expectedValue = 'Connected(Component)';
        const ConnectedComponent = connect( p=>p, ()=>null );
        assert.equal(ConnectedComponent.displayName, expectedValue);
      });

    });

  });

});
