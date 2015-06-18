// <---- Required Modules ---->
var mongoose = require('mongoose');

// <---- Schema ---->
var categorySchema = mongoose.Schema({
        name: 		 { type: String,   default: "" },
		project_ids: { type: [String], default: [] }
});

// <---- Methods ---->



// create the model for users and expose it to our app
module.exports = mongoose.model('Category', categorySchema);

