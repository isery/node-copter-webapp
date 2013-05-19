
/*
 * GET home page.
 */


exports.index = function(req, res){
  res.render('index', { title: 'Node-Copter', author: 'Georg Eschbacher & Michael Hettegger', description: 'Fly the Node-Copter'});
};


exports.contact = function(req, res){
  res.render('contact', { title: 'Node-Copter', author: 'Georg Eschbacher & Michael Hettegger', description: 'Fly the Node-Copter'});
};

exports.about = function(req, res){
  res.render('about', { title: 'Node-Copter', author: 'Georg Eschbacher & Michael Hettegger', description: 'Fly the Node-Copter'});
};

exports.connect = function(req, res){
  res.render('connect', { title: 'Node-Copter', author: 'Georg Eschbacher & Michael Hettegger', description: 'Fly the Node-Copter'});
};

exports.i18n = function(req, res){
  res.render('i18n', { title: 'Node-Copter', author: 'Georg Eschbacher & Michael Hettegger', description: 'Fly the Node-Copter'});
};