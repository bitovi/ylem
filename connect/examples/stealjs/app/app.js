import React, { Component } from 'react';
import { connect, ObserveObject } from 'ylem';

import './app.css';

export class AppStore extends ObserveObject {
	count = 0

	increment = () => {
		this.count++;
	}

	decrement = () => {
		this.count--;
	}
}

export class App extends Component {
	render() {
		const { count, increment, decrement } = this.props;

		return (
			<div className="App">
				<header className="App-header">
					<img src="assets/logo.svg" className="App-logo" alt="logo" />
					<h1 className="App-title">Welcome to Ylem</h1>
				</header>
				<p className="App-intro">
					To get started, edit <code>src/App.js</code> and save to reload.
				</p>
				<p className="App-intro">
					<button onClick={decrement}>-</button>
					<span id="count"> {count} </span>
					<button onClick={increment}>+</button>
				</p>
			</div>
		);
	}
}

export default connect(AppStore)(App);
