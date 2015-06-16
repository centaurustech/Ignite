// <---- Required Modules ---->
var mongoose = require('mongoose');

// <---- Schema ---->
var commentSchema = mongoose.Schema({
       project_id:  String,
	   user_id: 	String,
	   comment: 	String
});

// <---- Methods ---->

// create the model for users and expose it to our app
module.exports = mongoose.model('Comment', commentSchema);
