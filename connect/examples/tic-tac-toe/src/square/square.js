import './square.css';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class Square extends Component {
	static propTypes = {
		onClick: PropTypes.func.isRequired,
		value: PropTypes.oneOf([
			'X',
			'O',
		]),
	};

	render() {
		const { onClick, value } = this.props;

		return (
			<button className="square" onClick={onClick}>
				{value}
			</button>
		);
	}
}

export default Square;
