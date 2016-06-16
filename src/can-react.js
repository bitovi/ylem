import React from 'react';
import compute from 'can/compute/compute';

export function connect(mapToProps, ComponentToConnect) {
  const connectDisplayName = `Connected(${ getDisplayName(ComponentToConnect) })`;

  const mapToState = (props) => {
    return Object.assign( {}, props, mapToProps(props) );
  };

  class ConnectedComponent extends React.Component {

    constructor(props) {
      super(props);
      this.propsCompute = compute(props);
      this.compute = compute(() => {
        return mapToState( this.propsCompute() );
      });
      this.state = this.compute();
      this.compute.bind("change", (ev, newVal) => {
        this.setState(newVal);
      });
    }

    componentWillReceiveProps(nextProps) {
      this.propsCompute(nextProps);
    }

    render() {
      return React.createElement(ComponentToConnect, this.state);
    }

  }

  ConnectedComponent.displayName = connectDisplayName;

  return ConnectedComponent;
}

function getDisplayName(ComponentToConnect) {
  return ComponentToConnect.displayName || ComponentToConnect.name || 'Component';
}
