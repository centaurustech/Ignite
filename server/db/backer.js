// <---- Required Modules ---->
var mongoose = require('mongoose');

// <---- Schema ---->
var backerSchema = mongoose.Schema({
        project_id: { type: String,   default: "" },
		funded: 	{ type: Number,   default: 0  },
		user_id: 	{ type: String,   default: "" }
});

// <---- Methods ---->

// create the model for users and expose it to our app
module.exports = mongoose.model('Backer', backerSchema);
