// <---- Required Modules ---->
var mongoose = require('mongoose');

var Backer = require('./backer');

// <---- Schema ---->
var projectSchema = mongoose.Schema({
        image:              { type: String,   default: ""       },
        title:              { type: String,   default: ""       },
        start_date:         { type: Date,     default: Date.now },
        end_date:           { type: Date,     default: Date.now },
        budget:             { type: Number,   default: 0        },
        funded:             { type: Number,   default: 0        },
        resources:          { type: [String], default: []       },
        description:        { type: String,   default: ""       },
        budget_breakdown:   { type: String,   default: ""       },
        challenges:         { type: String,   default: ""       },
        value_proposition:  { type: String,   default: ""       },
        is_approved:        { type: Boolean,  default: false    },
        category:           { type: String,   default: ""       },
        backers:            { type: [String], default: []       },
        creator:            { type: String,   default: ""       },
        comments:           { type: [String], default: []       },
        team_members:       { type: [String], default: []       },
        city:               { type: String,   default: ""       },
        followers:          { type: [String], default: []       },
        country:            { type: String,   default: ""       },
        is_in_progress:     { type: Boolean,  default: true     }
});

// <---- Methods ---->

/**
 * Create a new backer, add it to the database, and add the backer id to the project.
 * If the backer already exists, update the fund.
 */

projectSchema.methods.addBacker = function(backer_id, funded, callback) {
    var project = this;
    
    // Check if the user has already backed the project
    Backer.find({}, function(err, backers) {
        if(err) { console.error(err); }
        
        backers.forEach(function(backer) {
            if(backer.user_id === backer_id) {
                // Update funded with new funded
                backer.funded += +funded;
            }
            
            return;
            
        }, this);
        
        // Create a new backer and add the _id to the project.
        var backer = new Backer();
        backer.user_id = backer_id;
        backer.funded = funded;
        
        backer.save(function(err, backer) {
            if(err) { callback(err); }
            console.log("saved the new backer and adding backer_id to project");
            project.backers.push(backer._id);
            project.funded = Number(project.funded) + Number(funded);
            callback(null);
        });
    });
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Project', projectSchema);
