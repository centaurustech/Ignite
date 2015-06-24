// <---- Required Modules ---->
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Backer = require('./backer');

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

// create the model for users and expose it to our app
module.exports = mongoose.model('Project', projectSchema);
