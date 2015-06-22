/**
 * Routes for the main page.
 */
var express  = require('express');
var passport = require('passport');
var User     = require('../db/user');
var router   = express.Router();

// TODO: use for all api requests
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();
	// if they aren't redirect them to the home page
	res.sendFile('login.html', { root: "public" });
};

module.exports = router;
