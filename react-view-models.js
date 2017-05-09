import React from 'react';
import ReactDOM from 'react-dom';
import compute from 'can-compute';
import DefineMap from 'can-define/map/map';

export default class CanReactComponent extends React.Component {
  constructor() {
    super();

    this._render = this.render;
    this.render = compute(function() {
      return this._render();
    }, this);

    if (typeof this.shouldComponentUpdate === 'function') {
      this._shouldComponentUpdate = this.shouldComponentUpdate;
    }
    this.shouldComponentUpdate = () => false;

    { // TODO: Remove in PROD
      let methodAsString = null;

      methodAsString = this.componentWillMount.toString();
      if (
        this.componentWillMount !== CanReactComponent.prototype.componentWillMount
        && !methodAsString.includes('componentWillMount', methodAsString.indexOf(') {'))
      ) {
        throw new Error(`super.componentWillMount() must be called on ${ this.constructor.name }.`);
      }

      methodAsString = this.componentWillUnmount.toString();
      if (
        this.componentWillUnmount !== CanReactComponent.prototype.componentWillUnmount
        && !methodAsString.includes('componentWillUnmount', methodAsString.indexOf(') {'))
      ) {
        throw new Error(`super.componentWillUnmount() must be called on ${ this.constructor.name }.`);
      }

      methodAsString = this.componentWillReceiveProps.toString();
      if (
        this.componentWillReceiveProps !== CanReactComponent.prototype.componentWillReceiveProps
        && !methodAsString.includes('componentWillReceiveProps', methodAsString.indexOf(') {'))
      ) {
        throw new Error(`super.componentWillReceiveProps() must be called on ${ this.constructor.name }.`);
      }
    }
  }

  get props() {
    return this.viewModel;
  }

  set props(value) {
    this._props = value;
  }

  componentWillMount() {
    const ViewModel = this.constructor.ViewModel || DefineMap;
    this.viewModel = new ViewModel( this._props );

    let batchNum;
    this.render.bind("change", (ev, newVal) => {
      if(!ev.batchNum || ev.batchNum !== batchNum) {
        batchNum = ev.batchNum;

        if (typeof this._shouldComponentUpdate !== 'function' || this._shouldComponentUpdate()) {
          this.forceUpdate();
        }
      }
    });
  }

  componentWillUnmount() {
    this._render.off('change');
    this.viewModel = null;
  }

  componentWillReceiveProps(nextProps) {
    this.viewModel.set( nextProps );
  }
}

export function makeRenderer(ViewModel, App) {
  if (!App) {
    App = ViewModel;
    ViewModel = null;
  }

  if (!(App.prototype instanceof React.Component)) {
    let render = App;
    class Wrapper extends CanReactComponent {
      render() {
        return render(this.props);
      }
        }
    Wrapper.ViewModel = ViewModel;

    App = Wrapper;
  }

  return function(viewModel) {
    var props = compute(function() {
      let props = {};
      viewModel.each(function (val, name) {
        props[name] = val;
      });

      return props;
    });

    const frag = document.createDocumentFragment();
    ReactDOM.render( <App {...props()} />, frag);

    props.on('change', function(ev, newValue) {
      ReactDOM.render( <App {...newValue} />, frag);
    });

    return frag;
  };
}
