import QUnit from 'steal-qunit';
import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import DefineMap from 'can-define/map/map';

import CanReactComponent, { makeRenderer } from '../react-view-models';

function getTextFromFrag(node){
  var txt = "";
  node = node.firstChild;
  while(node) {
    if(node.nodeType === 3) {
      txt += node.nodeValue;
    } else {
      txt += getTextFromFrag(node);
    }
    node = node.nextSibling;
  }
  return txt;
}

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
        render() {
          return <div>{this.props.foobar}</div>;
        }
      }
      TestComponent.ViewModel = DefinedViewModel;

      const testInstance = ReactTestUtils.renderIntoDocument( <TestComponent /> );
      assert.ok( testInstance.viewModel instanceof DefinedViewModel );
      assert.ok( testInstance.props === testInstance.viewModel );
    });

    QUnit.test('should update whenever any observable property on the viewModel instance changes', (assert) => {
      class TestComponent extends CanReactComponent {
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

    QUnit.test('should update the component when new props are received', (assert) => {
      class TestComponent extends CanReactComponent {
        render() {
          return <div>{this.props.foo}</div>;
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
      class TestComponent extends CanReactComponent {
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
      class TestComponent extends CanReactComponent {
        render() {
          return <div>{this.props.foobar}</div>;
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

      const wrappingInstance = ReactTestUtils.renderIntoDocument( <WrappingComponent /> );
      const testInstance = ReactTestUtils.scryRenderedComponentsWithType(wrappingInstance, TestComponent)[0];

      const actual = testInstance.props.interceptedCallback();

      assert.equal(actual, expectedValue, 'Value returned from wrapping components callback successfully');
      assert.equal(testInstance.props.interceptedCallbackCalled, true, 'ViewModels interceptedCallback was called');
      delete testInstance.props.interceptedCallbackCalled;
    });

  });

  QUnit.module('when using makeRenderer', () => {

    QUnit.test('should work with render function', (assert) => {
      let ViewModel = DefineMap.extend({
        foo: {
          type: 'string',
          value: 'foo'
        },
        bar: 'string',
        foobar: {
          get() {
            return this.foo + this.bar;
          }
        }
      });

      let first = true;
      var renderer = makeRenderer(ViewModel, (props) => {
        if (first) {
          first = false;
          assert.ok(props instanceof ViewModel);
        }

        return <div>{ props.foobar }</div>;
      });

      var viewModel = new DefineMap({ foo: 'foo1', bar: 'bar1' });
      var frag = renderer(viewModel);

      assert.equal(getTextFromFrag(frag), 'foo1bar1');
      viewModel.foo = 'bar';
      assert.equal(getTextFromFrag(frag), 'barbar1');
    });

    QUnit.test('should work with component class', (assert) => {
      let first = true;
      class TestComponent extends CanReactComponent {
        render() {
          if (first) {
            first = false;
            assert.ok(this.props instanceof TestComponent.ViewModel);
          }

          return <div>{this.props.foobar}</div>;
        }
      }
      TestComponent.ViewModel = DefineMap.extend({
        foo: {
          type: 'string',
          value: 'foo'
        },
        bar: 'string',
        foobar: {
          get() {
            return this.foo + this.bar;
          }
        }
      });

      var renderer = makeRenderer(TestComponent);

      var viewModel = new DefineMap({ foo: 'foo1', bar: 'bar1' });
      var frag = renderer(viewModel);

      assert.equal(getTextFromFrag(frag), 'foo1bar1');
      viewModel.foo = 'bar';
      assert.equal(getTextFromFrag(frag), 'barbar1');
    });

  });

});
