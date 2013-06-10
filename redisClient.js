redis = require('redis'),
redisClient = redis.createClient();


exports.saveToRedis = function(key,callback) {
	if(redisClient.sismember('codes',key)) {
		console.log('ismember');
		redisClient.incr(key);
		redisClient.get(key, function(err, reply) {
		    // reply is null when the key is missing
		    callback(reply,key);
		});
	}
}

exports.getNames = function(callback) {
	redisClient.smembers('thomas',function(err,reply) {
		callback(reply);
	});
}

exports.setNames = function(callback) {
	redisClient.sadd('thomas',function(err,reply) {
		callback(reply);
	});
}

