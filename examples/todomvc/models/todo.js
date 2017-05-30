import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import superMap from "can-connect/can/super-map/";
import set from "can-set";
import fixture from "can-fixture";

const Todo = DefineMap.extend('Todo', {
	id: "string",
	name: "string",
	complete: {
		type: "boolean",
		value: false
	}
});

Todo.List = DefineList.extend('TodoList', {
	"#": Todo,
	get active() {
		return this.filter({ complete: false });
	},
	get complete() {
		return this.filter({ complete: true });
	},
	get allComplete() {
		return this.length === this.complete.length;
	},
	get saving() {
		return this.filter(function(todo) {
			return todo.isSaving();
		});
	},
	updateCompleteTo: function(value) {
		this.forEach(function(todo) {
			todo.complete = value;
			todo.save();
		});
	},
	destroyComplete: function() {
		this.complete.forEach(function(todo) {
			todo.destroy();
		});
	}
});

Todo.connection = superMap({
	url: "/api/todos",
	Map: Todo,
	List: Todo.List,
	name: "todo",
	algebra: todoAlgebra
});

export default Todo;

var todoAlgebra = new set.Algebra(
	set.props.boolean("complete"),
	set.props.id("id"),
	set.props.sort("sort")
);

var todoStore = fixture.store([
  { name: "mow lawn", complete: false, id: 5 },
  { name: "dishes", complete: true, id: 6 },
  { name: "learn canjs", complete: false, id: 7 }
], todoAlgebra);

fixture("/api/todos", todoStore);
fixture.delay = 1000;
