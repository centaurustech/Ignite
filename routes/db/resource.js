// <---- Required Modules ---->
var mongoose = require('mongoose');

// <---- Schema ---->
var resourceSchema = mongoose.Schema({
        project_id: String,
		role: String,
		description: String
});

// <---- Methods ---->

// create the model for users and expose it to our app
module.exports = mongoose.model('Resource', resourceSchema);
