/** 
 * All urls that start with '/api/user' will route to this module.
 * 
 */
var express  = require('express');
var passport = require('passport');
var router   = express.Router();
var app      = express();

var Project  = require('../../db/project');
var User     = require('../../db/user');
var Backer   = require('../../db/backer');


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
 * Route to retrieve all user
 * query string parameter p must match the password.
 */
router.get('/user/getAll', function(req, res) {
    var password = req.query.p;
    
    if(password !== "admin") {
        res.status(400).send(null);
        return;
    }
    
    User.find({}, function(err, users){
        if(err) { console.error(err); return; }
        
        res.json(users);
    });
});


/**
 * Route to set a user as a budget owner.
 */
router.post('/user/makeBudgetOwner', function(req, res) {
   var user_id = req.query.id;
   
   User.findOne({_id : user_id}, function(err, user) {
       if(err) { console.error(err); return;}
       if(user) {
           user.is_budget_owner = true;
           
           user.save(function(err, data) {
               if(err) { console.error(err); return;}
               res.json(data);
           })
       }
   });
});

/**
 * Retrieve a user by id
 */
router.get('/user/', function(req, res) {
    var id = req.query.id;
    var query = User.findById({_id : id});
    
    query.exec(function(err, data) {
        if(err) { console.error(err); }
        res.json(data);
    })
});


/**
 * Retrieve the current user
 */
router.get('/user/currentDummyUser', function(req, res) {
    if(req.user) {
        res.json(req.user);    
    } else {
        res.json(null);
    }     
});

/**
 * Retrieve the current user from their employee ID.
 * If they are not registered in the database, add them.
 */
router.post('/user/currentUser', function(req, res) {
    var employeeInfo = req.body;

    var query = User.findOne({"employee_id": employeeInfo.empId});
    
    query.exec(function(err, user) {
        if(err) {
            console.error(err); return;
        }
        
        if(user) {
            // the user exists, return from database.
            res.json(user);
        } else {
            // the user doesn't exist. register and then return.
            var newUser = new User();
            
            newUser.employee_id = employeeInfo.empId;
            newUser.first_name  = employeeInfo.given_name;
            newUser.last_name   = employeeInfo.family_name;
            newUser.full_name   = employeeInfo.given_name + " " + employeeInfo.family_name,
            newUser.image       = employeeInfo.picture;
            newUser.phone       = employeeInfo.phone;
            newUser.title       = employeeInfo.job_role;
            newUser.department  = employeeInfo.dept;
            newUser.location    = employeeInfo.country;
            newUser.email       = employeeInfo.email;
            
            newUser.save(function(err, registeredUser) {
               if(err) { console.error(err); return; }
               res.json(registeredUser); 
            });
        }
        
    });   
});

/**
 * Retrieve all approved projects associated to a user
 */
router.get('/user/projects/:id', function(req, res) {
    var query = Project.find({$and : [{creator: req.id}, {is_approved: true}]})
        .populate({path: 'creator', model: 'User'})
        .populate({path: 'category', model: 'Category'})
        .populate({path: 'backers', model: 'Backer'})
        .populate({path: 'city', model: 'City'})
        .populate({path: 'resources', model: 'Resource'})
        .populate({path: 'comments', model: 'Comment'});
    
    query.exec(function(err, projects) {
        if(err) { console.error(err); } 
       
       // Populate users inside of backers separately since 
       // the original populate cannot populate nested refs.
       User.populate(projects, {
           path: 'backers.user_id'
       }, function(err, projects) {
           User.populate(projects, {
               path: 'comments.user_id'
           }, function(err, projects) {
                res.json(projects);    
           });
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
        .populate({path: 'resources', model: 'Resource'})
        .populate({path: 'comments', model: 'Comment'});
        
           query.exec(function(err, projects) {
           if(err) { console.error(err); } 
           
           // Populate users inside of backers separately since 
           // the original populate cannot populate nested refs.
           User.populate(projects, {
               path: 'backers.user_id',
           }, function(err, projects) {
               User.populate(projects, {
                       path: 'comments.user_id'
                   }, function(err, projects) {
                        res.json(projects);    
                   });
           });
        });
   });
       
});

/**
 * Retrieve all projects that the user has funded
 */
 router.get('/user/fundedProjects/:id', function(req, res) {
    User.findById({ "_id" : req.id }, function(err, user) {
         if(err) { console.error(err); }
         var projectIds = user.funded;
         console.log(user);
         var query = Project.find( { _id : { $in : projectIds } })
          .populate({path: 'creator', model: 'User'})
          .populate({path: 'category', model: 'Category'})
          .populate({path: 'backers', model: 'Backer'})
          .populate({path: 'resources', model: 'Resource'})
          .populate({path: 'comments', model: 'Comment'});
            
         query.exec(function(err, projects) {
            if(err) { console.error(err); } 
            
            User.populate(projects, {
                   path: 'backers.user_id'
               }, function(err, projects) {
                   User.populate(projects, {
                       path: 'comments.user_id'
                   }, function(err, projects) {
                        res.json(projects);    
                   });
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
                          full_name         : req.body.first_name + " " + req.body.last_name,
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