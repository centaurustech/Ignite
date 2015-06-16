/**
 * Routes for the main page.
 */
var express  = require('express');
var passport = require('passport');
var User     = require('../db/user');
var router   = express.Router();

/* GET home page. */
router.get('/', function (req, res) {    
    res.render('pages/index', { layout: 'layout', user : req.user });
});

/* GET register page */
router.get('/register', function(req, res) {
    res.render('pages/register', { });
});

/* POST register page to register */
router.post('/register', function(req, res) {
    User.register(new User({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {            
            return res.render('pages/register', { account : account });
        }
        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

/* GET login page */
router.get('/login', function(req, res) {
    res.render('pages/login', { user : req.user });
});

/* POST login page to login */
router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;
