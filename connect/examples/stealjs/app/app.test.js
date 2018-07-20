import React from 'react';
import TestRenderer from 'react-test-renderer';
import { expect } from 'chai';

import { App, AppStore } from './app';

describe('AppStore', () => {
	describe('count property', () => {
		it('is initialized at 0', () => {
			const store = new AppStore();

			expect(store).to.have.property('count', 0);
		});
	});

	describe('increment method', () => {
		it('increases the count property', () => {
			const store = new AppStore();
			store.increment();

			expect(store).to.have.property('count', 1);
		});

		it('is bound to the instance', () => {
			const store = new AppStore();

			const increment = store.increment;
			increment();

			expect(store).to.have.property('count', 1);
		});
	});
});

describe('App', () => {
	describe('count property', () => {
		it('is displayed as expected', () => {
			const renderer = TestRenderer.create(
				<App count={29} />
			);

			// note: children is an array
			const count = renderer.root.findByProps({ id: 'count' });
			expect(count.children).to.include('29');
		});
	});

	describe('increment property', () => {
		it('is called when the button is clicked', () => {
			let called = false;
			const renderer = TestRenderer.create(
				<App increment={() => called = true} />
			);

			const buttons = renderer.root.findAllByType('button');

			expect(called).to.equal(false);
			buttons[1].props.onClick();
			expect(called).to.equal(true);
		});
	});

	describe('decrement property', () => {
		it('is called when the button is clicked', () => {
			let called = false;
			const renderer = TestRenderer.create(
				<App decrement={() => called = true} />
			);

			const buttons = renderer.root.findAllByType('button');
			expect(called).to.equal(false);
			buttons[0].props.onClick();
			expect(called).to.equal(true);
		});
	});
});
