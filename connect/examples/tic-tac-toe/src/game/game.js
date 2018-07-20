import './game.css';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect, ObserveObject } from 'ylem';

import Board from '../board/board';

export class GameStore extends ObserveObject {
	id = `${Date.now()}-${Math.random()}`

	reset = () => {
		this.id = `${Date.now()}-${Math.random()}`;
	}
}

export class Game extends Component {
	static propTypes = {
		id: PropTypes.node.isRequired,
		reset: PropTypes.func.isRequired,
	}

	render() {
		const { id, reset } = this.props;

		return (
			<div className="game">
				<div className="game-board">
					<Board key={id} />
				</div>

				<button className="game-reset" onClick={reset}>Reset</button>
			</div>
		);
	}
}

export default connect(GameStore)(Game);
