// <---- Required Modules ---->
var mongoose = require('mongoose');

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
        is_approved:        Boolean,
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
projectSchema.methods.get = function() {
    
};



// create the model for users and expose it to our app
module.exports = mongoose.model('Project', projectSchema);
