
/*
 * GET home page.
 */
redisCli = require('../redisClient'),
object = { title: 'Node-Copter', author: 'Georg Eschbacher & Michael Hettegger', description: 'Fly the Node-Copter'};


exports.index = function(req, res){
  res.render('index', object);
};


exports.contact = function(req, res){
  res.render('contact', object);
};

exports.about = function(req, res){
	redisCli.getNames(function(data) {
		var names = data;
		res.render('about', {names : names, title: 'Node-Copter', author: 'Georg Eschbacher & Michael Hettegger', description: 'Fly the Node-Copter'});
	});
};

exports.connect = function(req, res){
  res.render('connect', object);
};

exports.i18n = function(req, res){
  res.render('i18n', object);
};