/// <reference path="typings/node/node.d.ts"/>

// <---- Required Modules ---->
var express         = require('express');
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var mongoose        = require('mongoose');
var passport        = require('passport');
var multer          = require('multer');
var LocalStrategy   = require('passport-local').Strategy;

// <---- User Defined Modules ---->
var configDB        = require('./config/database.js');

// <----- MongoDB Set Up ----->
mongoose.connect(configDB.url); // connect to our database

// <----- Include API route js files ----->
//var project    = require('./server/routes/api/project');
var user          = require('./server/routes/api/user');
var project       = require('./server/routes/api/project');
var developer     = require('./server/routes/api/developer');


var app = express();

// <---- View Set Up ---->
//app.set('view engine', 'html');
 
// Favicon
app.use(favicon(__dirname + '/public/assets/favicon.ico'));

// <---- Middleware setup ---->
app.use(logger('dev'));
app.use(multer({ dest: './public/assets/project_images'}));
app.use(bodyParser.json({limit: '5mb'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

// <---- Local Passport for Login ---->
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


// passport config
var User = require('./server/db/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// <---- Routes for API ----->
app.use('/api', user
              , project
              , developer);


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
