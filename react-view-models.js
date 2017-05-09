import React from 'react';
import ReactDOM from 'react-dom';
import compute from 'can-compute';

export default class CanReactComponent extends React.Component {
  constructor() {
    super();

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
    this.viewModel = this._vm || new this.constructor.ViewModel( this._props );

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
}

export function makeRender(App) {
	return function(viewModel) {
		var c = compute(function() {
			let props = {};

			let keys = Object.keys(viewModel.get());
			for (let key of keys) {
				props[key] = viewModel[key];
			}

			return props;
		});

		const div = document.createElement('div');
		c.on('change', function(ev, newValue) {
			ReactDOM.render(React.createElement(App, newValue), div);
		});

		return div;
	};
}
