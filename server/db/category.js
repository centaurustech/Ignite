// <---- Required Modules ---->
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

// <---- Schema ---->
var categorySchema = mongoose.Schema({
        name: 		 { type: String,            default: "" },
		project_ids: { type: [Schema.ObjectId], ref:     'Project' }
});

// <---- Methods ---->



// create the model for users and expose it to our app
module.exports = mongoose.model('Category', categorySchema);

