import React from 'react';
import TestRenderer from 'react-test-renderer';
import { expect } from 'chai';

import { Square } from './square';

describe('Square', () => {
	describe('value property', () => {
		it('is displayed as expected', () => {
			const renderer = TestRenderer.create(
				<Square value="X" onClick={() => {}} />
			);

			const value = renderer.root.findByType('button');
			expect(value.children).to.include('X');
		});
	});

	describe('onClick property', () => {
		it('is called when the button is clicked', () => {
			let called = false;
			const renderer = TestRenderer.create(
				<Square onClick={() => called = true} />
			);

			const button = renderer.root.findByType('button');

			expect(called).to.equal(false);
			button.props.onClick();
			expect(called).to.equal(true);
		});
	});
});
