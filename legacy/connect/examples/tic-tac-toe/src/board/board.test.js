import React from 'react';
import TestRenderer from 'react-test-renderer';
import { expect } from 'chai';

import { Board, BoardStore } from './board';

describe('BoardStore', () => {
	describe('squares property', () => {
		it('is initialized with nulls', () => {
			const store = new BoardStore();

			expect(store).to.have.deep.property('squares', [ null, null, null, null, null, null, null, null, null ]);
		});
	});

	describe('xIsNext property', () => {
		it('is initialized with true', () => {
			const store = new BoardStore();

			expect(store).to.have.property('xIsNext', true);
		});
	});
});

describe('Board', () => {
	describe('status property', () => {
		it('is displayed as expected', () => {
			const renderer = TestRenderer.create(
				<Board status="this is a status" select={() => {}} squares={[]} />
			);

			const count = renderer.root.findByProps({ className: 'board-status' });
			expect(count.children).to.include('this is a status');
		});
	});
});
