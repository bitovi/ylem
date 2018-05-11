import React from 'react';
import ReactDOM from 'react-dom';
import { Component } from 'ylem';

import 'can-view-model';
import 'can-debug';

class Counter extends Component { // 👀
	constructor(props) {
		super(props);
		this.state = { count: 0 };
	}

	increment = () => {
		this.state.count++; // 👀
	}

	render() {
		return (
			<div>
				Count: {this.state.count} {this.state.foo}<br />
				<button onClick={this.increment}>+1</button>
			</div>
		);
	}
}

const container = document.getElementById('app');
ReactDOM.render(<Counter />, container);
