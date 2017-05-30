import React from "react";
import DefineMap from "can-define/map/";
import { Component } from "react-view-models";
import Todo from "./models/todo";

import canBatch from "can-event/batch/batch";

export default class List extends Component {
	render() {
		return (
			<ul id="todo-list">
				{ this.props.todos && this.props.todos.map((todo) => (
					<li key={ todo.id } className={ [
						"todo",
						todo.complete && "completed",
						this.props.isEditing(todo) && "editing",
					].filter(v => v).join(" ") }>
						<div className="view">
							<input
								className="toggle"
								type="checkbox"
								checked={todo.complete}
								onChange={ () => {
									todo.complete = !todo.complete;
									todo.save();
								} }
							/>
							<label
								onDoubleClick={ () => this.props.edit(todo) }
							>{todo.name}</label>
							<button
								className="destroy"
								onClick={ () => todo.destroy() }
							></button>
						</div>
						<form onSubmit={ (e) => this.props.updateName(e) }>
							<input
								className="edit"
								type="text"
								value={todo.name}
								onChange={ (e) => todo.name = e.target.value }
								onBlur={ () => this.props.cancelEdit() }
							/>
						</form>
					</li>
				)).serialize() }
			</ul>
		);
	}
}

List.ViewModel = DefineMap.extend("TodoListVM", {
	todos: Todo.List,
	editing: Todo,
	backupName: "string",
	isEditing(todo) {
		return todo === this.editing;
	},
	edit(todo) {
		canBatch.start();
		this.backupName = todo.name;
		this.editing = todo;
		canBatch.stop();
	},
	cancelEdit() {
		if (this.editing) {
			this.editing.name = this.backupName;
		}
		this.editing = null;
	},
	updateName(e) {
		e && e.preventDefault();

		this.editing.save();
		this.editing = null;
	}
});
