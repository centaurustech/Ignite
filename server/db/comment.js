// <---- Required Modules ---->
var mongoose = require('mongoose');

// <---- Schema ---->
var commentSchema = mongoose.Schema({
       project_id:  { type: String,   default: "" },
	   user_id: 	{ type: String,   default: "" },
	   comment: 	{ type: String,   default: "" }
});

// <---- Methods ---->

// create the model for users and expose it to our app
module.exports = mongoose.model('Comment', commentSchema);
