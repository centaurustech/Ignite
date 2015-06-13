/// <reference path="typings/node/node.d.ts"/>
// <---- Required Modules ---->
var express         = require('express');
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var mongoose        = require('mongoose');

// <---- User Defined Modules ---->
var configDB        = require('./config/database.js');

// <----- MongoDB Set Up ----->
mongoose.connect(configDB.url); // connect to our database

// <----- Include route js files ----->
var routes = require('./routes/index');
var users  = require('./routes/users');
var api    = require('./routes/services');


var app = express();

// <---- View Set Up ---->
app.use(express.static(path.join(__dirname, 'views')));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

// <---- Middleware setup ---->
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

// <---- Routes ----->
app.use('/', routes);
app.use('/users', users); 
app.use('/api', api);





// <---- Error Handling ---->
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Development error handler to print stack trace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});


module.exports = app;
