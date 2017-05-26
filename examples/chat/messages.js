import React from "react";
import route from "can-route";
import DefineMap from "can-define/map/";
import { Component } from "react-view-models";
import { PromiseViewModel } from "react-view-models/helpers/";
import Message from "./models/message";

export default class Messages extends Component {
	render() {
		return (
			<div>
				<h1 className="page-header text-center">Chat Messages</h1>
				<h5><a href={route.url({ page: "home" })}>Home</a></h5>

				{ this.props.messagesPromise.isPending ? (
					<div className="list-group-item list-group-item-info">
						<h4 className="list-group-item-heading">Loading...</h4>
					</div>
				) : null }

				{ this.props.messagesPromise.isRejected ? (
					<div className="list-group-item list-group-item-danger">
						<h4 className="list-group3--item-heading">Error</h4>
						<p className="list-group-item-text">{this.props.messagesPromise.reason}</p>
					</div>
				) : null }

				{ this.props.messagesPromise.isResolved ? (
					this.props.messagesPromise.value ? (
						this.props.messagesPromise.value.map(({ name, body }, key) => (
							<div className="list-group-item" key={key}>
								<h4 className="list-group3--item-heading">{name}</h4>
								<p className="list-group-item-text">{body}</p>
							</div>
						)).serialize() // TODO: iterable DefineList means no .serialize()
					) : (
						<div className="list-group-item">
							<h4 className="list-group-item-heading">No messages</h4>
						</div>
					)
				) : null }

				<form className="row" onSubmit={ (ev) => this.props.send(ev) }>
					<div className="col-sm-3">
						<input
							type="text"
							className="form-control"
							placeholder="Your name"
							value={this.props.name}
							onChange={ (e) => this.props.name = e.target.value }
						/>
					</div>
					<div className="col-sm-6">
						<input
							type="text"
							className="form-control"
							placeholder="Your message"
							value={this.props.body}
							onChange={ (e) => this.props.body = e.target.value }
						/>
					</div>
					<div className="col-sm-3">
						<input type="submit" className="btn btn-primary btn-block" value="Send" />
					</div>
				</form>
			</div>
		);
	}
}

Messages.ViewModel = DefineMap.extend({
	messagesPromise: {
		Type: PromiseViewModel,
		value: Message.getList({}),
	},
	name: {
		type: "string",
		value: ""
	},
	body: {
		type: "string",
		value: ""
	},
	send: function(event) {
		event.preventDefault();

		new Message({
			name: this.name,
			body: this.body
		}).save().then(() => {
			this.body = "";
		});
	}
});
