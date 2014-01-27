require('newrelic');
var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var passport = require('passport');
var path = require('path');

var app = express();
app.set('port', process.env.PORT || 3000);
app.engine('.html', require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

var config = require('./config/config')[app.get('env')];

/**
 * MongoDB init (connect, models...)
 */

mongoose.connect(config.db);
require('./models/user');
require('./config/passport')(passport, config);

/**
 * Basic Middlewares
 */

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/**
 * Auth Middleware
 */

app.use(express.cookieParser(config.app.secretKey));
app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());

/**
 * Router Middlewares
 */

app.use(app.router);
app.use(express.compress());
app.use(express.static(path.join(__dirname, 'public')));
require('./config/routes')(app, passport, config);

/**
 * Create http server
 */

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
