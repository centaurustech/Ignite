// <---- Required Modules ---->
var mongoose = require('mongoose');

var Backer = require('./backer');

// <---- Schema ---->
var projectSchema = mongoose.Schema({
        image:              String,
        title:              String,
        start_date:         Date,
        end_date:           Date,
        budget:             Number,
        funded:             Number,
        resources:          [String],
        description:        String,
        budget_breakdown:   String,
        challenges:         String,
        value_proposition:  String,
        is_approved:        { type: Boolean, default: false },
        category:           String,
        backers:            [String],
        creator:            String,
        comments:           [String],
        team_members:       [String],
        city:               String,
        followers:          [String],
        country:            String
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
                backer.funded = funded;
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
            
            callback(null);
        });
    });
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Project', projectSchema);
