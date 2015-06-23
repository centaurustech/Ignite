/** 
 * All urls that start with '/api/project' will route to this module.
 * 
 */
var express = require('express');
var router = express.Router();
var app = express();

var Project = require('../../db/project');

//// Middleware to retrieve the project from the id in the path and attach to req object
//router.param('id', function(req, res, next, id) {
//    
//    var query = Project.findById(id);
//    
//    query.exec(function (err, project){
//        if (err) { return next(err); }
//        if (!project) { 
//            res.status(404).send('Not Found');
//            return;
//         }
//        
//        req.project = project;    
//        return next();
//    });
//    
//});

/**
 * Retrieve all categories.
 * 
 * <Usage>
 *      /api/project/categories
 */
router.get('/project/categories', function(req, res) {
    res.send('["Technology", "Customer Service", "Investment", "HR", "Environment", "Innovation", "Life", "Love", "HSBC"]');
});


// ======================================================== //
//                                                          //
//             CRUD Operations on Project Model             //
//                                                          //
// ======================================================== //


/**
 * Route to retrieve a single project by it's id.
 * id is a field in the request object
 * 
 * <Usage> 
 *  /api/project/[id] 
 */
router.get('/project/:id', function(req, res) {
    var query = Project.findOne({"_id": req.id});
    query.exec(function(err, project) {
        if(err) {
            console.error(err);
        }
        
        if(!project) {
            res.send("Not Found");
        } else {
            res.json(project);
        }
    });
});

/**
 * Retrieve all projects.
 * 
 * <Usage>
 *     /api/project
 */
router.get('/project', function(req, res, next) {
    
    Project.find(function(err, projects) {
       if(err) { return next(err); } 
       
       res.json(projects);
    });
    
});



/**
 * Route to create a project.
 * Project is a field in the request object.
 * 
 * <Usage>
 *     /api/project/[id]
 */
router.post('/project', function(req, res, next) {
    
    var project = new Project(req.body);
    
    project.save(function(err) {
       if(err) { next(err); } 
    });
    
    res.end();
    
});

/**
 * Route to update a project by id.
 * The updated project is in the request body.
 * 
 * <Usage>
 *     /api/project/[id]
 */
router.put('/project/:id', function(req, res) {
    
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
        if(err) { next(err); }
    });
    
});



// ======================================================== //
//                                                          //
//           Custom Operations on Project Model             //
//                                                          //
// ======================================================== //

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
router.put('/project/:id/add_backer', function(req, res, next) {
    // Request objects
    var project = req.project;
    var backer_id = req.query.backer_id;
    var funded = req.query.funded; 
    
    project.addBacker(backer_id, funded, function(err) {
        if(err) { console.error(err); }
        
        console.log("saving project with backer");
        project.save(function(err) {
            if(err) { next(err); } 
        });
    });
    res.end();
});


module.exports = router;