/** 
 * All urls that start with '/api/user' will route to this module.
 * 
 */
var express = require('express');
var router = express.Router();
var app = express();

var User = require('../../db/user');

// Middleware to retrieve the id from the path and attach to req object
router.param('id', function(req, res, next, id) {
    req.id = id;
    return next();
});


// ======================================================== //
//                                                          //
//          CRUD Operations on User Model                   //
//                                                          //
// ======================================================== //

/**
 *  Route to retrieve a single user by it's id.
 *  id is a field in the request object
 */
router.get('/user/:id', function(req, res) {
    res.send(req.id);
});

/**
 *  Route to retrieve all users.
 */
router.get('/user', function(req, res) {
    res.send("ALL USERS");
});

/**
 * Route to create a user.
 * The new user is in the request body.
 */
router.post('/user', function(req, res, next) {
    
    var user = new User(req.body);
    
    user.save(function(err) {
       if(err) { next(err); } 
    });
    
    res.end();
});

/**
 * Route to update a user by id.
 * The updated user is in the request body.
 */
router.put('/user/:id', function(req, res) {
    
});

/**
 * Route to delete a user by id.
 * id is a field in the request object. 
 */
router.delete('/user/:id', function(req, res) {
    
});


module.exports = router;