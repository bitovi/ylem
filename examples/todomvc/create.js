import React from "react";
import DefineMap from "can-define/map/";
import { Component } from "react-view-models";
import Todo from "./models/todo";

export default class Create extends Component {
	render() {
		return (
			<form onSubmit={ (e) => this.props.createTodo(e) }>
				<input id="new-todo"
					placeholder="What needs to be done?"
					value={this.props.todo.name}
				/>
			</form>
		);
	}
}

Create.ViewModel = DefineMap.extend("TodoCreateVM", {
	todo: { Value: Todo },
	createTodo: function(e) {
		e && e.preventDefault();

		this.todo.save().then(() => {
			this.todo = new Todo();
		});
	}
});
