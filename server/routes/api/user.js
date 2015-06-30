/** 
 * All urls that start with '/api/user' will route to this module.
 * 
 */
var express = require('express');
var passport = require('passport');
var router = express.Router();
var app = express();

var User = require('../../db/user');

// ======================================================== //
//                                                          //
//          CRUD Operations on User Model                   //
//                                                          //
// ======================================================== //

/**
 * Retrieve the current user
 */
router.get('/user/currentUser', function(req, res) {
    if(req.user) {
        res.json(req.user);    
    } else {
        res.json(null);
    }     
});

/**
 * Route to register a user.
 * The new user is in the request body.
 */
router.post('/user/register', function(req, res) {
    User.register(new User(
                        { username          : req.body.username,
                          first_name        : req.body.first_name,
                          last_name         : req.body.last_name,
                          title             : req.body.title,
                          department        : req.body.department,
                          location          : req.body.location,
                          email             : req.body.email,
                          is_budget_owner   : req.body.is_budget_owner,
                          is_approver       : req.body.is_approver }),
                          req.body.password,
                          function(err, account) {
        if (err) {
            res.status(400).send('Username already in use');
        } else {
            passport.authenticate('local')(req, res, function () {
            res.json(req.user);
            });
        }
    });
});

/* POST login page to login */
router.post('/user/login', passport.authenticate('local'), function(req, res) {
    res.send(req.user);
});

/* POST logout */
router.post('/user/logout', function(req, res) {
    req.logout();
    res.redirect('/#/loginView');
});

module.exports = router;