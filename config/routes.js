module.exports = {

	"prefix": "/api",

	"get": {

		"/": "/hello",

		"/hello": {

			controller:"hello",
			method: "world",

			filters: []
		},

		"/admin": "/admin/info",

		"/admin/info": {

			controller: "admin",
			method: "info",

			filters: ["authenticated", "admin"]
		},

		"/admin/sample_hidden_command": {

			controller: "hello",
			method: "world",

			filters: ["authenticated", "admin"]
		},

		"/whatsapp/on_message_received": {

			controller: "whatsapp",
			method: "onMessageReceived",

			filters: []
		},

		"/whatsapp/on_group_message_received": {

			controller: "whatsapp",
			method: "onGroupMessageReceived",

			filters: []
		},

		"/whatsapp/on_group_info": {

			controller: "whatsapp",
			method: "onGroupInfo",

			filters: []
		},

		"/user/twtreq": {
			controller:"user",
			method:"twitter_request"
		},

		"/user/twtcallback": {
			controller:"user",
			method:"twitter_callback"
		},

		"/user/me": {

			controller:"user",
			method: "me",

			filters: ["authenticated"]
		},

		"/user/complete": {

			controller:"user",
			method: "complete_login",

			filters: ["authenticated"]
		}
	},

	post: {

		"/admin/create": {

			controller:"admin",
			method: "create",

			filters: ["authenticated"] //,'root']
		},

		"/user/create": {

			controller:"user",
			method: "create",

			filters: []
		},

		"/user/social": {

			controller:"user",
			method: "social_login",

			filters: ["authenticated"]
		},

		"/user/login": {

			controller:"user",
			method: "login",

			filters: []
		},

		"/user/logout": {

			controller:"user",
			method: "logout",

			filters: ["authenticated"]
		},

		"/user/complete": {

			controller:"user",
			method: "complete_login",

			filters: ["authenticated"]
		},

		"/user/changenumber": {

			controller:"user",
			method: "change_number",

			filters: ["authenticated"]
		},

		"/user/changeemail": {

			controller:"user",
			method: "change_email",

			filters: ["authenticated"]
		},

		"/user/disabletwitter": {

			controller:"user",
			method: "disable_twitter",

			filters: ["authenticated"]
		},

		"/user/enabletwitter": {

			controller:"user",
			method: "enable_twitter",

			filters: ["authenticated"]
		},

		"/user/disableemail": {

			controller:"user",
			method: "disable_email",

			filters: ["authenticated"]
		},

		"/user/enableemail": {

			controller:"user",
			method: "enable_email",

			filters: ["authenticated"]
		},
		
		"/user/clear": {
			controller:"user",
			method:"clear", 

			filters: ["authenticated"]
		}
	}
}