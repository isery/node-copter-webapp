redis = require('redis'),
redisClient = redis.createClient();


exports.saveToRedis = function(key,callback) {
	redisClient.sismember(['codes', key], function(err, reply) {
		if(reply) {
			redisClient.incr(key);
			redisClient.get(key, function(err, reply) {
			    // reply is null when the key is missing
			    callback(reply,key);
			});
		}
		else {
			callback(0,key);
		}
	});
}

exports.getNames = function(callback) {
	redisClient.smembers('userList',function(err,reply) {
		callback(reply);
	});
}

exports.setNames = function(key, callback) {
	redisClient.sadd('userList', key, function(err,reply) {
		callback(reply);
	});
}

