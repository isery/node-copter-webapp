
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    connect = require('connect'),
    path = require('path');

var app = express();

var lingua = require('lingua');



app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());

  app.use(lingua(app, {
        defaultLocale: 'en',
        path: __dirname + '/i18n'
    }));


  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  //app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(connect['static'](path.join(__dirname + '/public')));
  //app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/contact',routes.contact);
app.get('/about',routes.about);
app.get('/connect',routes.connect);
app.get('/i18n',routes.i18n);
module.exports = app;
