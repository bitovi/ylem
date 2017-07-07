var Observation = require("can-observation");
var assign = require("can-util/js/assign/assign");

function Observer() {
	var self = this;
	Observation.call(self, null, null, function() { return self.listener && self.listener(); });
}

Observer.prototype = Object.create(Observation.prototype);
Observer.prototype.constructor = Observer;

assign(Observer.prototype, {
	start: function() {
		this.value = {};
	},
	startLisening: function(listener) {
		this.listener = listener || this.listener;

		this.bound = true;
		this.oldObserved = this.newObserved || {};
		this.ignore = 0;
		this.newObserved = {};

		Observation.observationStack.push(this);
	},
	stopListening: function() {
		if (Observation.observationStack[Observation.observationStack.length - 1] !== this) {
			var index = Observation.observationStack.indexOf(this);
			if (index === -1) {
				throw new Error("Async observations stopped out of order.");
			}

			Observation.observationStack.splice(index, 1);
			Observation.observationStack.push(this);
		}

		Observation.observationStack.pop();
		this.updateBindings();
	},
});

module.exports = Observer;
