import './board.css';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect, ObserveObject } from 'ylem';

import Square from '../square/square';

export class BoardStore extends ObserveObject {
	squares = Array(9).fill(null)
	xIsNext = true

	calculateWinner() {
		const lines = [
			[ 0, 1, 2 ],
			[ 3, 4, 5 ],
			[ 6, 7, 8 ],
			[ 0, 3, 6 ],
			[ 1, 4, 7 ],
			[ 2, 5, 8 ],
			[ 0, 4, 8 ],
			[ 2, 4, 6 ],
		];

		for (const [ a, b, c ] of lines) {
			if (this.squares[a]
				&& this.squares[a] === this.squares[b]
				&& this.squares[a] === this.squares[c]
			) {
				return this.squares[a];
			}
		}

		return null;
	}

	select = (i) => {
		if (this.calculateWinner(this.squares) || this.squares[i]) {
			return;
		}

		this.squares[i] = this.xIsNext ? 'X' : 'O';
		this.xIsNext = !this.xIsNext;
	}

	get status() {
		const winner = this.calculateWinner(this.squares);

		return winner
			? `Winner: ${winner}`
			: `Next player: ${this.xIsNext ? 'X' : 'O'}`
		;
	}
}

export class Board extends Component {
	static propTypes = {
		status: PropTypes.string.isRequired,
		select: PropTypes.func.isRequired,
		squares: PropTypes.arrayOf(PropTypes.oneOf([
			null,
			'X',
			'O',
		])).isRequired,
	}

	render() {
		const { status, select, squares } = this.props;

		return (
			<div className="board">
				<div className="board-status">{status}</div>
				<div className="board-row">
					<Square value={squares[0]} onClick={() => select(0)} />
					<Square value={squares[1]} onClick={() => select(1)} />
					<Square value={squares[2]} onClick={() => select(2)} />
				</div>
				<div className="board-row">
					<Square value={squares[3]} onClick={() => select(3)} />
					<Square value={squares[4]} onClick={() => select(4)} />
					<Square value={squares[5]} onClick={() => select(5)} />
				</div>
				<div className="board-row">
					<Square value={squares[6]} onClick={() => select(6)} />
					<Square value={squares[7]} onClick={() => select(7)} />
					<Square value={squares[8]} onClick={() => select(8)} />
				</div>
			</div>
		);
	}
}

export default connect(BoardStore)(Board);
