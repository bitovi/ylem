import chai from 'chai';
import { connect } from '../can-react';
import React from 'react';
import compute from 'can/compute/';
import ReactTestUtils from 'react-addons-test-utils';
import 'steal-mocha';
const assert = chai.assert;

describe('can-react', function(){

  describe('connect()', () => {
    let TestComponent;
    let shallowRenderer;

    beforeEach(() => {
      TestComponent = React.createClass({
        render() {
          return React.createElement('div', { className: 'test' });
        }
      });
      shallowRenderer = ReactTestUtils.createRenderer();
    });

    it('should not (by default) render additional dom nodes that the ones from the extended Presentational Component', () => {

      const ConnectedComponent = connect( () => ({ value: 'bar' }), TestComponent );

      shallowRenderer.render( React.createElement( ConnectedComponent, { value: 'foo' } ) );

      const result = shallowRenderer.getRenderOutput();

      assert.equal(result.type, TestComponent); // not ConnectedComponent
      assert.equal(result.props.value, 'bar'); // not 'foo'

    });

    it('should update the component whenever an observable read inside the mapToProps function emits a change event', function() {
      const observable = compute('Inital Value');
      const ConnectedComponent = connect( () => ({ value: observable() }), TestComponent );

      const result = ReactTestUtils.renderIntoDocument( React.createElement( ConnectedComponent ) );
      const childComponent = ReactTestUtils.scryRenderedComponentsWithType(result, TestComponent)[0];

      assert.equal(childComponent.props.value, 'Inital Value');
      observable('new value');
      assert.equal(childComponent.props.value, 'new value');

    });

    it('should update the component when new props are recieved', function() {
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

      const result = ReactTestUtils.renderIntoDocument( React.createElement( WrappingComponent ) );
      const childComponent = ReactTestUtils.scryRenderedComponentsWithType(result, TestComponent)[0];

      assert.equal(childComponent.props.propValue, 'Initial Prop Value');
      result.changeState();
      assert.equal(childComponent.props.propValue, 'New Prop Value');
    });

  });

});
