// <---- Required Modules ---->
var mongoose = require('mongoose');

// <---- Schema ---->
var categorySchema = mongoose.Schema({
        name: 		 String,
		project_ids: [String]
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Category', categorySchema);
