import React from 'react';
import ReactDOM from 'react-dom';
import compute from 'can-compute';
import DefineMap from 'can-define/map/map';

export default class CanReactComponent extends React.Component {
  constructor() {
    super();

    this._compute = compute(() => null);
    this._compute.computeInstance.observation._async = true;

    if (typeof this.shouldComponentUpdate === 'function') {
      this._shouldComponentUpdate = this.shouldComponentUpdate;
    }
    this.shouldComponentUpdate = () => false;

    { // TODO: Remove in PROD
      let methods = [
        'componentWillReceiveProps',
        'componentWillMount',
        'componentDidMount',
        'componentWillUpdate',
        'componentDidUpdate',
        'componentWillUnmount',
      ];

      methods.forEach((method) => {
        let methodAsString = this[method].toString();
        if (
          this[method] !== CanReactComponent.prototype[method]
          && !methodAsString.includes(method, methodAsString.indexOf(') {'))
        ) {
          throw new Error(`super.${ method }() must be called on ${ this.constructor.name }.`);
        }
      });
    }
  }

  get props() {
    return this.viewModel;
  }

  set props(value) {
    this._props = value;
  }

  componentWillReceiveProps(nextProps) {
    this.viewModel.set( nextProps );
  }

  componentWillMount() {
    const ViewModel = this.constructor.ViewModel || DefineMap;
    this.viewModel = new ViewModel( this._props );

    let batchNum;
    this._compute.bind("change", (ev) => {
      if(!ev.batchNum || ev.batchNum !== batchNum) {
        batchNum = ev.batchNum;

        if (typeof this._shouldComponentUpdate !== 'function' || this._shouldComponentUpdate()) {
          this.forceUpdate();
        }
      }
    });

    this._compute.computeInstance.observation.asyncStart();
  }

  componentDidMount() {
    this._compute.computeInstance.observation.asyncEnd();
  }

  componentWillUpdate() {
    this._compute.computeInstance.observation.asyncStart();
  }

  componentDidUpdate() {
    this._compute.computeInstance.observation.asyncEnd();
  }

  componentWillUnmount() {
    this._compute.off('change');
    this.viewModel = null;
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
