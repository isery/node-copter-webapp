redis = require('redis'),
redisClient = redis.createClient();


exports.saveToRedis = function(key,callback) {
	redisClient.incr(key);
	redisClient.get(key, function(err, reply) {
	    // reply is null when the key is missing
	    console.log(reply);
	    callback(reply,key);
	});
}
