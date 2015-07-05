/** 
 * All urls that start with '/api/project' will route to this module.
 * 
 */
var express = require('express');
var router = express.Router();
var app = express();

var Project = require('../../db/project');
var Category = require('../../db/category');
var City = require('../../db/city');

// Middleware to retrieve the id and attach it to the req object.
router.param('id', function(req, res, next, id) {
    req.id = id;
    return next();
});


///**
// * Retrieve all projects that are under a single category
// * identified by the category name.
// * 
// * <Usage>
// *      /api/project/byCategory?category=[name]
// */
//router.get('/project/byCategory', function(req, res) {
//    var categoryName = req.query.category;
//    
//    var query = Category.find({name: categoryName}, 'projects')
//                        .populate('projects');
//    query.exec(function(err, projects) {
//        if(err) { console.error(err); return; }
//        
//        
//    });
//});


/**
 * Retrieve all categories.
 * 
 * <Usage>
 *      /api/project/categories
 */
router.get('/project/categories', function(req, res) {
    Category.find({}, function(err, categories) {
        if(err) console.error(err);
        res.send(categories);
    });
});

/**
 * Retrieve all cities.
 * 
 * <Usage>
 *      /api/project/cities
 */
router.get('/project/cities', function(req, res) {
    City.find({}, function(err, cities) {
        if(err) console.error(err);
        res.send(cities);
    });    
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
    var query = Project.find({is_approved: true})
        .populate({path: 'creator', model: 'User'})
        .populate({path: 'category', model: 'Category'})
        .populate({path: 'city', model: 'City'});
        
    query.exec(function(err, projects) {
       if(err) { return next(err); } 
       
       res.json(projects);
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
    var userJSON    = JSON.parse(req.body.user);
    var projectJSON = JSON.parse(req.body.project);
    var resources = projectJSON.resources;
    var city = projectJSON.city;
    var category = projectJSON.category;
    
    // Only include project image if it has been uploaded
    if(req.files.file) {
        projectJSON.image = "/assets/project_images/" + req.files.file.name;
    }
    
    // Remove these fields from the project since they will be referenced
    // in mongodb directly to the object rather than the name.
    delete projectJSON.resources;
    delete projectJSON.city;
    delete projectJSON.category;
    
    var project = new Project(projectJSON);
    
    // Add resources to the project
    resources.forEach(function(resource) {
        project.addResource(resource.role, resource.description, function(err, data) {
            if(err) console.error(err);
        });
    });
    
    // Set the city for the project
    project.setCity(city, function(err, project) {
       if(err) console.error(err);
       // Set the category for the project.
       project.setCategory(category, function(err, project) {
           if(err) console.error(err);
           // Set the creator for the project.
           project.addCreator(userJSON._id, function(err, project) {
                if(err) console.error(err);
                  
                res.end(String(project._id));    
           });        
       }); 
    });
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
router.post('/project/:id/add_backer', function(req, res, next) {
    // Request objects
    var backer_id = req.query.backer_id;
    var funded = req.query.funded; 
    
    console.log(req.query);
    
    var query = Project.findOne({"_id": req.id});
    
    query.exec(function(err, project) {
        if(err) {
            console.error(err);
            return;
        }
        
        if(!project) {
            res.send("Not Found");
        } else {
            project.addBacker(backer_id, funded, function(err, project) {
                if(err) { console.error(err); return;}
                res.json(project); 
             });
        }
    });
});


module.exports = router;