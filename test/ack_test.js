var should = require("should");
var ack = require("../api/services/ack");

describe("ack service", function(){

	it("should bind callback to hello method", function(done) {

		ack.bind("hello", function(method) {
			method.response.command.should.equal("social");
			done();
		})

		ack.recognize("hello");
	});

	it("should bind callback to hello method using aliases", function(done) {

		ack.bind("hello", function(method) {
			method.response.command.should.equal("social");
			done();
		})

		ack.recognize("saudações");
	});

	it("should bind callback to hello method using aliases with caps", function(done) {

		ack.bind("hello", function(method) {
			method.response.command.should.be.exactly("social");
			done();
		})

		ack.recognize("HI");
	});
})