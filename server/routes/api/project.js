/** 
 * All urls that start with '/api/project' will route to this module.
 * 
 */
var express  = require('express');
var router   = express.Router();
var app      = express();

var Project  = require('../../db/project');
var Category = require('../../db/category');
var City     = require('../../db/city');
var User     = require('../../db/user');
var Resource = require('../../db/resource');

// Middleware to retrieve the id and attach it to the req object.
router.param('id', function(req, res, next, id) {
    req.id = id;
    return next();
});

/**
 * Retrieve all categories.
 * 
 * <Usage>
 *      /api/project/categories
 */
router.get('/project/categories', function(req, res) {
    Category.find({}, function(err, categories) {
        if (err) console.error(err);
        res.send(categories);
    });
});

/**
 * Route to approve a project 
 * 
 * <Usage>
 *      /api/project/approveProject?id=[id]
 * 
 * <Query String Parameters>
 *      id: The _id of the project to start funding.
 */
router.post('/project/approveProject', function(req, res) {
    var id = req.query.id;
    var start_date = req.query.start_date;

    var startDate = new Date(start_date);

    var dbDate = new Date();
    var dbEndDate = new Date();

    // Add the in the date, month, and year
    dbDate.setDate(startDate.getDate());
    dbDate.setMonth(startDate.getMonth());
    dbDate.setFullYear(startDate.getFullYear());
    dbDate.setHours(0);
    dbDate.setMinutes(0);
    dbDate.setSeconds(0);
    // set the end date as the start date + 30.
    dbEndDate.setDate(dbDate.getDate() + 30);

    Project.findOne({
        _id: id
    }, function(err, project) {
        if (err) {
            console.error(err);
            return;
        }

        project.is_approved = true;
        project.start_date = dbDate;
        project.end_date = dbEndDate;

        project.save(function(err, savedProject) {
            savedProject.populateAll(function(err, project) {
                if (err) {
                    console.error(err);
                    return;
                }

                res.json(project);
            });
        });
    })
});


/**
 * Route to retrieve all projects that have not been approved.
 * query string parameter p must match the password.
 * 
 * <Usage>
 *      /api/project/nonApproved?p=[password]
 * 
 * <Query String Parameters>
 *      password: please stop paining me to write this.
 */
router.get('/project/nonApproved', function(req, res) {
    var password = req.query.p;

    if (password !== "admin") {
        res.status(400).send(null);
        return;
    }

    var query = Project.find({
            is_approved: false
        })
        .populate({
            path: 'creator',
            model: 'User'
        })
        .populate({
            path: 'category',
            model: 'Category'
        })
        .populate({
            path: 'backers',
            model: 'Backer'
        })
        .populate({
            path: 'city',
            model: 'City'
        })
        .populate({
            path: 'resources',
            model: 'Resource'
        })
        .populate({
            path: 'comments',
            model: 'Comment'
        });

    query.exec(function(err, projects) {
        if (err) {
            console.error(err);
            return;
        }

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
 * Route to retrieve a single project by it's id.
 * id is a field in the request object
 * 
 * <Usage> 
 *  /api/project/[id] 
 */
router.get('/project/:id', function(req, res) {
    var query = Project.findOne({
        "_id": req.id
    });

    query.exec(function(err, project) {
        if (err) {
            console.error(err);
        }

        if (!project) {
            res.send("Not Found");
        } else {
            project.populateAll(function(err, project) {
                res.json(project);
            });

        }
    });
});


/**
 * Retrieve all projects that are approved.
 * 
 * <Usage>
 *     /api/project
 */
router.get('/project', function(req, res, next) {
    var query = Project.find({
            is_approved: true
        })
        .populate({
            path: 'creator',
            model: 'User'
        })
        .populate({
            path: 'category',
            model: 'Category'
        })
        .populate({
            path: 'backers',
            model: 'Backer'
        })
        .populate({
            path: 'city',
            model: 'City'
        })
        .populate({
            path: 'resources',
            model: 'Resource'
        })
        .populate({
            path: 'comments',
            model: 'Comment'
        });

    query.exec(function(err, projects) {
        if (err) {
            return next(err);
        }

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
 * Route to create a project.
 * Project is a field in the request body.
 * Multer (middleware) has already parsed the image, 
 * 
 * <Usage>
 *     /api/project/
 */
router.post('/project', function(req, res, next) {
    var userJSON = JSON.parse(req.body.user);
    var projectJSON = JSON.parse(req.body.project);
    var resources = projectJSON.resources;
    var category = projectJSON.category.name;

    // Only include project image if it has been uploaded
    if (req.files.file) {
        projectJSON.image = "/assets/project_images/" + req.files.file.name;
    } else {
        projectJSON.image = "/assets/project_images/default_project_image.jpg";
    }

    // Remove these fields from the project since they will be referenced
    // in mongodb directly to the object rather than the name.
    delete projectJSON.resources;
    delete projectJSON.category;

    var project = new Project(projectJSON);
    project.is_approved = false;

    // Add resources to the project
    resources.forEach(function(resource) {
        project.addResource(resource.role, resource.description, function(err, data) {
            if (err) console.error(err);
        });
    });


    // Set the category for the project.
    project.setCategory(category, function(err, project) {
        if (err) console.error(err);
        // Set the creator for the project.
        project.addCreator(userJSON._id, function(err, project) {
            if (err) console.error(err);

            res.end(String(project._id));
        });
    });

});

/**
 * Route to delete a project by id.
 * Project is a field in the request object. 
 * 
 * <Usage>
 *     /api/project/[id]
 */
router.delete('/project/:id', function(req, res, next) {

    var project = req.project;

    project.delete(function(err) {
        if (err) {
            next(err);
        }
    });

});

/**
 * Route to add a backer to a project 
 * Project is a field in the request object
 * 
 * <Usage>
 *      /api/project/[project_id]/add_backer?backer_id=[backer_id]&funded=[funded]
 * 
 * <Query String Parameters>
 *      backer_id: user_id associated to the user funding the project
 *      funded:    The amount being funded
 */
router.post('/project/:id/add_backer', function(req, res, next) {
    // Request objects
    var backer_id = req.query.backer_id;
    var funded = req.query.funded;

    var query = Project.findOne({
        "_id": req.id
    });

    query.exec(function(err, project) {
        if (err) {
            console.error(err);
            return;
        }

        if (!project) {
            res.send("Not Found");
        } else {
            project.addBacker(backer_id, funded, function(err, project) {
                if (err) {
                    console.error(err);
                    return;
                }
                res.json(project);
            });
        }
    });
});

/**
 * Route to add a follower to a project
 * <Usage>
 *      /api/project/[project_id]/add_follower?user_id=[user_id]
 * 
 * <Query String Parameters>
 *  user_id: The id of the user to follow the project
 */
router.post('/project/:id/add_follower', function(req, res, next) {
    var user_id = req.query.user_id;

    var query = Project.findOne({
        "_id": req.id
    });

    query.exec(function(err, project) {
        if (err) {
            console.error(err);
            return;
        }

        if (!project) {
            res.send("Not Found");
        } else {
            project.addFollower(user_id, function(err, project) {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log("added backer");
                res.json(project);
            });
        }
    });

});

/**
 * Route to add a comment to a project
 * <Usage>
 *      /api/project/[project_id]/add_comment?user_id=[user_id]&comment=[comment]
 * 
 * <Query String Parameters>
 *  user_id: The id of the user to follow the project
 *  comment: The comment to add.
 */

router.post('/project/:id/add_comment', function(req, res) {
    var user_id = req.query.user_id;
    var comment = req.query.comment;

    var query = Project.findOne({
        "_id": req.id
    });

    query.exec(function(err, project) {
        if (err) {
            console.error(err);
            return;
        }

        if (!project) {
            res.send("Not Found");
        } else {
            project.addComment(user_id, comment, function(err, project) {
                if (err) {
                    console.error(err);
                    return;
                }
                project.populateAll(function(err, project) {
                    res.json(project.comments);
                });
            });
        }
    })
})

module.exports = router;
