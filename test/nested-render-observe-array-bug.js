import QUnit from 'steal-qunit';
import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import { connect } from 'ylem';
import { Object as ObserveObject } from 'can-observe';

QUnit.module('nested component ObserveArray', () => {
	QUnit.test('does not render forever', (assert) => {
		const done = assert.async();

		class MyComponent extends Component {
			render () {
				return <div>{this.props.text}</div>;
			}
		}

		class ViewModel extends ObserveObject {
			items = []

			constructor () {
				super();

				setTimeout(() => {
					// Setting this synchronously fixes the problem
					this.items = [{ text: 'Hello' }];
				}, 0);
			}

			foo () {

			}
		}

		@connect(ViewModel)
		class AppComponent extends Component {
			render () {
				const {
					items,
					foo, // eslint-disable-line no-unused-vars
				} = this.props;

				// Casting this to an Array fixes the problem
				return items.map((item, key) => (
					// Changing this to a plain div fixes the problem
					<MyComponent key={key} text={item.text} />
				));
			}
		}

		const div = document.createElement('div');
		ReactDOM.render(<AppComponent />, div);

		assert.equal(div.outerHTML, '<div></div>');
		setTimeout(() => {
			assert.equal(div.outerHTML, '<div><div>Hello</div></div>');

			done();
		}, 100);
	});
});
