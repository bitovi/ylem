import React from 'react';
import ReactDOM from 'react-dom';
import compute from 'can-compute';

export default class CanReactComponent extends React.Component {
  constructor() {
    super();

    if (!this.constructor.ViewModel) {
        throw new Error(`static ViewModel must be specified on ${ this.constructor.name }.`);
    }

    this._render = this.render;
    this.render = compute(function() {
      return this._render();
    }, this);
  }

  get props() {
      return this.viewModel;
  }

  set props(value) {
      this._props = value;
  }

  componentWillMount() {
    this.viewModel = new this.constructor.ViewModel( this._props );

    let batchNum;
    this.render.bind("change", (ev, newVal) => {
      if(!ev.batchNum || ev.batchNum !== batchNum) {
        batchNum = ev.batchNum;
        this.forceUpdate();
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

  shouldComponentUpdate() {
      return false;
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
