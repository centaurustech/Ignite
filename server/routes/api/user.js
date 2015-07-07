/** 
 * All urls that start with '/api/user' will route to this module.
 * 
 */
var express = require('express');
var passport = require('passport');
var router = express.Router();
var app = express();

var Project = require('../../db/project');
var User = require('../../db/user');


// Middleware to retrieve the id and attach it to the req object.
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
 * Retrieve all approved projects associated to a user
 */
router.get('/user/projects/:id', function(req, res) {
    var query = Project.find({$and : [{creator: req.id}, {is_approved: true}]})
        .populate({path: 'creator', model: 'User'})
        .populate({path: 'category', model: 'Category'})
        .populate({path: 'backers', model: 'Backer'})
        .populate({path: 'city', model: 'City'});
    
    query.exec(function(err, projects) {
        if(err) { console.error(err); } 
       
       // Populate users inside of backers separately since 
       // the original populate cannot populate nested refs.
       User.populate(projects, {
           path: 'backers.user_id',
       }, function(err, projects) {
           res.json(projects);
       }); 
    });
});

/**
 * Retrieve all project that the user is following
 */
router.get('/user/followedProjects/:id', function(req, res) {
   User.findById( {_id: req.id}, function(err, user) {
       if(err) { console.error(err); }
       
       var projectIds = user.following;
       
       var query = Project.find( { _id : { $in : projectIds } })
        .populate({path: 'creator', model: 'User'})
        .populate({path: 'category', model: 'Category'})
        .populate({path: 'backers', model: 'Backer'})
        .populate({path: 'city', model: 'City'});
        
           query.exec(function(err, projects) {
           if(err) { console.error(err); } 
           
           // Populate users inside of backers separately since 
           // the original populate cannot populate nested refs.
           User.populate(projects, {
               path: 'backers.user_id',
           }, function(err, projects) {
               console.log(projects);
               res.json(projects);
           });
        });
   });
       
});

/**
 * Retrieve all non approved projects associated to a user
 */
router.get('/user/pendingProjects/:id', function(req, res) {
    Project.find({$and : [{creator: req.id}, {is_approved: false}]}, function(err, projects){
        if(err) { console.error(err); }
        res.json(projects);
    });
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