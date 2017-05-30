import "./styles.css";

import React from "react";
import route from "can-route";
import DefineMap from "can-define/map/";
import reactViewModel from "react-view-models";
import Create from "./create";
import List from "./list";
import Todo from "./models/todo";

const AppVM = DefineMap.extend('AppVM', {
	filter: "string",
	get todosPromise() {
		if(!this.filter) {
			return Todo.getList({});
		}
		else {
			return Todo.getList({ complete: this.filter === "complete" });
		}
	},
	todosList: {
		get: function(lastSetValue, resolve) {
			this.todosPromise.then(resolve);
		}
	},
	get allChecked() {
		return this.todosList && this.todosList.allComplete;
	},
	set allChecked(newVal) {
		this.todosList && this.todosList.updateCompleteTo(newVal);
	}
});

const template = reactViewModel('App', AppVM, (props) => (
	<section id="todoapp">
		<header id="header">
			<h1>todos</h1>
			<Create />
		</header>

		<section id="main">
			<input
				id="toggle-all"
				type="checkbox"
				checked={ props.allChecked ? true : false }
				disabled={ props.todosList && props.todosList.saving.length }
			/>
			<label htmlFor="toggle-all">Mark all as complete</label>
			<List todos={ props.todosList } />
		</section>

		<footer id="footer">
			<span id="todo-count">
				<strong>{props.todosList && props.todosList.active.length}</strong> items left
			</span>

			<ul id="filters">
				<li>
					<a
						href={route.url({ filter: undefined })}
						className={ route.current({ filter: undefined }) ? "selected" : "" }
						>All</a>
				</li>
				<li>
					<a
						href={route.url({ filter: "active" })}
						className={ route.current({ filter: "active" }) ? "selected" : "" }
						>Active</a>
				</li>
				<li>
					<a
						href={route.url({ filter: "complete" })}
						className={ route.current({ filter: "complete" }) ? "selected" : "" }
						>Completed</a>
				</li>
			</ul>

			<button id="clear-completed"
				onClick={ () => props.todosList.destroyComplete() }>
				Clear completed ({props.todosList && props.todosList.complete.length})
			</button>
		</footer>
	</section>
));

const appVM = new AppVM();

route.data = appVM;
route("{filter}");
route.ready();

const frag = template(appVM);
document.body.appendChild(frag);
