import React from 'react';
import TestRenderer from 'react-test-renderer';
import { expect } from 'chai';

import { Game, GameStore } from './game';
import Board from '../board/board';

describe('GameStore', () => {
	describe('reset method', () => {
		it('changes the id property', () => {
			const store = new GameStore();
			const id = store.id;

			store.reset();

			expect(store.id).to.not.equal(id);
		});

		it('is bound to the instance', () => {
			const store = new GameStore();
			const id = store.id;

			const reset = store.reset;
			reset();

			expect(store).to.not.equal(id);
		});
	});
});

describe('Game', () => {
	describe('id property', () => {
		it('creates a new board when it changes', () => {
			const renderer = TestRenderer.create(
				<Game id="1" reset={() => {}} />
			);

			const board1 = renderer.root.findByType(Board);

			renderer.update(
				<Game id="2" reset={() => {}} />
			);

			const board2 = renderer.root.findByType(Board);

			expect(board1).to.not.equal(board2);
		});
	});

	describe('reset property', () => {
		it('is called when the button is clicked', () => {
			let called = false;
			const renderer = TestRenderer.create(
				<Game  id="1" reset={() => called = true} />
			);

			const button = renderer.root.findByProps({ className: 'game-reset' });

			expect(called).to.equal(false);
			button.props.onClick();
			expect(called).to.equal(true);
		});
	});
});
