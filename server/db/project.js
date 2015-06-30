// <---- Required Modules ---->
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Backer   = require('./backer');
var Comment  = require('./comment');
var User     = require('./user');
var Resource = require('./resource');
var Category = require('./category');
var City     = require('./city');

// <---- Schema ---->
var projectSchema = mongoose.Schema({
        image:              { type: String,     	   default: ""         },
        title:              { type: String,            default: ""         },
        start_date:         { type: Date,              default: Date.now   },
        end_date:           { type: Date,              default: Date.now   },
        budget:             { type: Number,            default: 0          },
        funded:             { type: Number,            default: 0          },
        resources:          { type: [Schema.ObjectId], ref:     'Resource' },
        description:        { type: String,            default: ""         },
        budget_breakdown:   { type: String,            default: ""         },
        challenges:         { type: String,            default: ""         },
        value_proposition:  { type: String,            default: ""         },
        is_approved:        { type: Boolean,           default: false      },
        category:           { type: Schema.ObjectId,   ref:     'Category' },
        backers:            { type: [Schema.ObjectId], ref:     'Backer'   },
        creator:            { type: Schema.ObjectId,   ref:     'User'     },
        comments:           { type: [Schema.ObjectId], ref:     'Comment'  },
        team_members:       { type: [Schema.ObjectId], ref:     'User'     },
        city:               { type: Schema.ObjectId,   ref:     'City'     },
        followers:          { type: [Schema.ObjectId], ref:     'User'     },
        is_in_progress:     { type: Boolean,           default: true       }
});

// <---- Methods ---->

/**
 * Create a new backer, add it to the database, and add the backer id to the project.
 * If the backer already exists, update the fund.
 */
projectSchema.methods.addBacker = function(backer_id, funded, callback) {
    var project = this;
    
    // Check if the user has already backed the project
    Backer.findOne({'user_id': backer_id, 'project_id': project._id}, function(err, backer) {
        if(err) { console.error(err); }
          
        if(backer) {
            // Update funded with new funded
            backer.funded += +funded;
            backer.save(function(err, result) {
                return callback(null, project);    
            }); 
         } else {
             // Create a new backer and add the _id to the project.
            var newBacker = new Backer();
            newBacker.user_id = backer_id;
            newBacker.funded = funded;
            newBacker.project_id = project._id;

            newBacker.save(function(err, result) {
                if(err) { callback(err); }
                                
                project.backers.push(result._id);
                project.funded = Number(project.funded) + Number(funded);
                project.save(function(err, proj) {
                        if(err) { console.error(err); }
                        return callback(null, proj);        
                });
            });
         } 
    });
};

/**
 * Add a comment to the project
 */
projectSchema.methods.addComment = function(user_id, comment, callback) {
    var project = this;

    // Create a new backer and add the _id to the project.
    var newComment = new Comment(
        {
            user_id:    user_id,
            comment:    comment,
            project_id: project._id
        }
    );
    
    newComment.save(function(err, result) {
        if(err) { callback(err); }
                        
        project.comments.push(result._id);
        project.save(function(err, proj) {
                if(err) { console.error(err); }
                return callback(null, proj);        
        });
    });     
};


projectSchema.methods.addFollower = function(user_id, callback) {
    var project = this;
    
    // Check if the user has already backed the project
    User.findOne({'_id': user_id}, function(err, user) {
        if(err) { console.error(err); }
        
        // User not found
        if(!user) {    
            console.log("No User Found");
            return callback(null, project);     
        } 
        
        // User is already a follower
        for(var i = 0; i < user.following.length; i++) {
            if(user.following[i].equals(project._id)) {
                return callback(null, project);
            }
        }
        
        // User is not a follower, add project_id to following
        user.following.push(project._id);

        user.save(function(err, resultUser) {
            if(err) { callback(err); }      
            // Add the user to the followers of project              
            project.followers.push(resultUser._id);
            project.save(function(err, proj) {
                    if(err) { console.error(err); }
                    return callback(null, proj);        
            });
        });
    });
};

projectSchema.methods.removeFollower = function(user_id, callback) {
    var project = this;
    
    // Check if the user has already backed the project
    User.findOne({'_id': user_id}, function(err, user) {
        if(err) { console.error(err); }
        
        // User not found
        if(!user) {    
            console.log("No User Found");
            return callback(null, project);     
        } 
        
        // User is a follower
        for(var i = 0; i < user.following.length; i++) {
            if(user.following[i].equals(project._id)) {
                // Remove project id from following
                user.following.splice(i, 1);
            }
        }
        
        

        user.save(function(err, resultUser) {
            if(err) { callback(err); }      
            // Remove the user from the followers of project              
            for(var i = 0; i < project.followers.length; i++) {
                if(project.followers[i].equals(user._id)) {
                    // Remove user id from followers
                    project.followers.splice(i, 1);
                }
            }
            
            project.save(function(err, proj) {
                    if(err) { console.error(err); }
                    return callback(null, proj);        
            });
        });
    });
};


/**
 * Add a resource to the project
 */
projectSchema.methods.addResource = function(role, description, callback) {
    var project = this;

    // Create a new backer and add the _id to the project.
    var newResource = new Resource(
        {
            project_id:    project._id,
            role:          role,
            description:   description
        }
    );
    
    newResource.save(function(err, result) {
        if(err) { callback(err); }
                        
        project.resources.push(result._id);
        project.save(function(err, proj) {
                if(err) { console.error(err); }
                return callback(null, proj);        
        });
    });     
};

/**
 * Set the category for the project
 */
 projectSchema.methods.setCategory = function(name, callback) {
     var project = this;
     
     
     Category.findOne({"name": name}, function(err, category) {
        if(err) { console.error(err); }
        
        project.category = category._id;        // Add the category id to the project,
        category.project_ids.push(project._id); // Add the project id to the category.
        
        category.save(function(err, catResult) {
            if(err) {console.error(err); }
            
            project.save(function(err, projResult) {
               if(err) {console.error(err); }
               
               return callback(null, projResult); 
            });
        });
     });
 };

/**
 * Set the city for the project
 */
 projectSchema.methods.setCity = function(cityName, callback) {
     var project = this;
     
     City.findOne({"name": cityName}, function(err, city) {
        if(err) { console.error(err); }
        
        project.city = city._id;                 // Add the category id to the project,
        city.project_ids.push(project._id);      // Add the project id to the category.
        
        city.save(function(err, cityResult) {
            if(err) {console.error(err); }
            
            project.save(function(err, projResult) {
               if(err) {console.error(err); }
               return callback(null, projResult); 
            });
        });
     });
 };

// create the model for users and expose it to our app
module.exports = mongoose.model('Project', projectSchema);
