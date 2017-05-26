import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import superMap from "can-connect/can/super-map/";

const Message = DefineMap.extend("Message", {
	id: "number",
	name: "string",
	body: "string",
	created_at: "date"
});

Message.List = DefineList.extend("MessageList", {
	"*": Message
});

Message.connection = superMap({
	url: {
		resource: "https://chat.donejs.com/api/messages",
		contentType: "application/x-www-form-urlencoded"
	},
	Map: Message,
	List: Message.List,
	name: "message"
});

export default Message;
