var fake   = require ( "../redisClient" );
var expect = require('expect.js');
var redis = require('redis');
var redisClient = redis.createClient();


describe('redis: ', function() {
	before(function(){
        redisClient.sadd('codes',"http://www.multimediatechnology.at");
        redisClient.sadd('codes',"http://www.fh-salzburg.ac.at");
        redisClient.sadd('codes',"http://www.vienname.mediacube.ac.at");
    });

	describe('#redis save', function() {
		it('should save a valid link in redis', function(done) {
			fake.saveToRedis("http://www.multimediatechnology.at", function(count, key) {
				expect(count).to.be.greaterThan(0);
				done();
			});		
		});
	});

	describe('#redis save', function() {
		it('should not save a invalid link in redis', function(done) {
			fake.saveToRedis("http://www.somewronglink.at", function(count, key) {
			expect(count).to.be(0);
			done();
			});		
		});
	});

	describe('#redis get', function() {
		it('should return a set of names', function(done) {
			fake.getNames(function(data) {
				expect(data).to.be.an('array');
				expect(data.indexOf('test')).to.not.be(undefined);
				expect(data.indexOf('test')).to.be.a('number');
				expect(data[data.indexOf('test')]).to.be('test');
				done();
			});		
		});
	});

	describe('#redis set', function() {
		it('should save a username in redis', function(done) {
			fake.setNames('test', function(data) {
				expect(data).to.be(0);
				done();
			});		
		});
	});
});




