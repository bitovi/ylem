import React from "react";
import route from "can-route";
import DefineMap from "can-define/map/";
import reactViewModel from "react-view-models";
import Messages from "./messages";

const AppVM = DefineMap.extend({
	page: "string",
	message: {
		type: "string",
		value: "Chat Home",
		serialize: false
	},
	addExcitement: function() {
		this.message = this.message + "!";
	}
});

const template = reactViewModel(AppVM, (props) => (
	<div className="container">
		<div className="row">
			<div className="col-sm-8 col-sm-offset-2">
				{ props.page === "home" ? (
					<div>
						<h1
							className="page-header text-center"
							onClick={ () => props.addExcitement() }
						>{props.message}</h1>
						<a
							href={route.url({ page: "chat" })}
							className="btn btn-primary btn-block btn-lg"
						>Start chat</a>
					</div>
				) : (
					<Messages />
				) }
			</div>
		</div>
	</div>
));

const appVM = new AppVM();

route.data = appVM;
route("{page}", { page: "home" });
route.ready();

const frag = template(appVM);
document.body.appendChild(frag);
