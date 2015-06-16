// <---- Required Modules ---->
var mongoose = require('mongoose');

// <---- Schema ---->
var backerSchema = mongoose.Schema({
        project_id: String,
		funded: 	Number,
		user_id: 	String
});

// <---- Methods ---->

// create the model for users and expose it to our app
module.exports = mongoose.model('Backer', backerSchema);
