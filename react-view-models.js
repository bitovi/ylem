/* eslint react/prop-types: 0 */
import React from 'react';
import compute from 'can-compute';
import DefineMap from "can-define/map/";

export function connect( MapToProps, ComponentToConnect ) {

  if ( typeof MapToProps !== 'function' ) {
    throw new Error('Setting the viewmodel to an instance or value is not supported');
  }

  class ConnectedComponent extends React.Component {

    constructor(props) {
      super(props);

      if ( MapToProps.prototype instanceof DefineMap ) {
        this.viewModel = new MapToProps( props );
        this.createMethodMixin();
        this.computedState = this.computedStateFromViewModel();
      } else {
        this.propsCompute = compute(props);
        this.computedState = this.computedStateFromFunction( MapToProps );
      }

      this.state = { propsForChild: this.computedState() };
      this.bindToComputedState();
    }

    computedStateFromViewModel() {
      return compute(() => {
        const vm = this.viewModel;
        const props = vm.serialize();
        return Object.assign({}, this.methodMixin, props);
      });
    }

    computedStateFromFunction( MapToPropsFunc ) {
      return compute(() => {
        const props = this.propsCompute();
        return Object.assign( {}, props, MapToPropsFunc(props) );
      });
    }

    bindToComputedState() {
      let batchNum;
      this.computedState.bind("change", (ev, newVal) => {
        if(!ev.batchNum || ev.batchNum !== batchNum) {
          batchNum = ev.batchNum;
          this.setState({ propsForChild: newVal });
        }
      });
    }

    componentWillReceiveProps(nextProps) {
      if (this.viewModel) {
        this.viewModel.set( nextProps );
      } else {
        this.propsCompute( nextProps );
      }
    }

    createMethodMixin() {
      const vm = this.viewModel;
      const methodMixin = {};
      getMethodNames( vm ).forEach( methodName => {
        methodMixin[methodName] = vm[methodName].bind(vm);
      });
      this.methodMixin = methodMixin;
    }

    render() {
      return React.createElement(ComponentToConnect, this.state.propsForChild, this.props.children);
    }

  }

  ConnectedComponent.displayName = `Connected(${ getDisplayName(ComponentToConnect) })`;

  return ConnectedComponent;
}

function getDisplayName( ComponentToConnect ) {
  return ComponentToConnect.displayName || ComponentToConnect.name || 'Component';
}

function getMethodNames( obj ) {
  const result = [];
  for (var key in obj) {
    try {
      if (typeof obj[key] === "function") {
        result.push( key );
      }
    } catch (err) {
      // do nothing
    }
  }
  return result;
}
