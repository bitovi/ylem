/* eslint react/prop-types: 0 */
import React from 'react';
import compute from 'can-compute';
import { isConstructor } from 'can-types';
import { makeArray } from 'can-util';

export const nobind = 'nobind';
export const asArray = 'asArray';

export function connect( ViewModel, ComponentToConnect, {
  properties = {},
  displayName,
  deepObserve = false
} = {} ) {

  if ( typeof ViewModel !== 'function' ) {
    throw new Error('Setting the viewmodel to an instance or value is not supported');
  }

  class ConnectedComponent extends React.Component {

    constructor(props) {
      super(props);

      if ( isConstructor( ViewModel ) ) {
        this.viewModel = new ViewModel( props );
        this._render = compute(this.observedRender, this);
        this.state = { viewModel: this.viewModel };
      } else {
        this.mapToProps = ViewModel;
        this.propsCompute = compute(props);
        this._render = compute(function(){
          const props = this.mapToProps( this.propsCompute() );
          return React.createElement( ComponentToConnect, props, this.props.children );
        }, this);
      }

      let batchNum;
      this._render.bind("change", (ev, newVal) => {
        if(!ev.batchNum || ev.batchNum !== batchNum) {
          batchNum = ev.batchNum;
          this.setState({ propsForChild: newVal });
        }
      });
    }

    observedRender() {
      const vm = this.viewModel;
      // this deepObserve could be improved if DefineMap has a deep observe option
      if (deepObserve) {
        vm.get();
      }
      let props = extractProps( vm, properties, this.props );
      return React.createElement( ComponentToConnect, props, this.props.children );
    }

    componentWillUnmount() {
      this._render.off('change');
      this.viewModel = null;
    }

    componentWillReceiveProps(nextProps) {
      if (this.viewModel) {
        this.viewModel.set( nextProps );
      } else {
        this.propsCompute( nextProps );
      }
    }

    render() {
      return this._render();
    }

  }

  ConnectedComponent.displayName = displayName || getDisplayName( ComponentToConnect );

  return ConnectedComponent;

}

// export connect as the default module
export default connect;

// exported for testing only
// NOTE: this is the most complicated part, maybe refactor so it's easier to read?
export function extractProps( vm, properties, ownProps ) {
  const props = {};
  if ( properties['...'] ) {
    Object.keys(ownProps).forEach(key => {
      if ( properties[key] !== false ) {
        props[key] = ownProps[key];
      }
    });
  }
  Object.keys(properties).forEach(key => {
    if (key === '...') return; // ignore special spread key
    const propertyVal = properties[key];
    if ( propertyVal ) {
      const bindFunction = typeof vm[key] === 'function' && propertyVal !== nobind;
      props[key] = bindFunction ? vm[key].bind(vm) : vm[key];
      if ( propertyVal === asArray ) {
        props[key] = makeArray( props[key] );
      }
    }
  });
  return props;
}

function getDisplayName( ComponentToConnect ) {
  const componentName = ComponentToConnect.displayName || ComponentToConnect.name || 'Component';
  return `Connected(${ componentName })`;
}
