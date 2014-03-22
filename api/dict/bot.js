module.exports = {
	
	"hello": {
		alias: ["hi", "oi", "ola", "falae", "hey", "saudações"],

		response: {
			content: "Hey, I'm the WhatsApp bot, and I'm here to help you integrate it with your favorite social networks. Which social network do you want to connect?",
			options: ["Twitter", "Instagram", "Facebook", "Gmail"]
		}
	},

	"error": {
		unknown_command: "Ops, I didn't understand what you asked;"
	}
}