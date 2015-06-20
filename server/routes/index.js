/**
 * Routes for the main page.
 */
var express  = require('express');
var passport = require('passport');
var User     = require('../db/user');
var router   = express.Router();

/* GET home page. */
router.get('/', isLoggedIn,  function (req, res) {    
    res.render('pages/index', { layout: 'layout', user : req.user });
});

function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();
	// if they aren't redirect them to the home page
	res.render('pages/login', { layout: 'layout', user : null });
};

module.exports = router;
