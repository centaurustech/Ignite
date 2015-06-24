// <---- Required Modules ---->
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

// <---- Schema ---->
var commentSchema = mongoose.Schema({
       project_id:  { type: Schema.ObjectId, ref:    'Project'   },
	   user_id: 	{ type: Schema.ObjectId, ref:    'User'      },
	   comment: 	{ type: String,   		 default: ""         },
	   timestamp:	{ type: Date,			 default: new Date() }
});

// <---- Methods ---->

// create the model for users and expose it to our app
module.exports = mongoose.model('Comment', commentSchema);
