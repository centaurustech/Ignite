// <---- Required Modules ---->
var mongoose = require('mongoose');

// <---- Schema ---->
var resourceSchema = mongoose.Schema({
        project_id:  { type: String,   default: "" },
		role:		 { type: String,   default: "" },
		description: { type: String,   default: "" }
});

// <---- Methods ---->

// create the model for users and expose it to our app
module.exports = mongoose.model('Resource', resourceSchema);
