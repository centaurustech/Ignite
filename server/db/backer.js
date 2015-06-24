// <---- Required Modules ---->
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

// <---- Schema ---->
var backerSchema = mongoose.Schema({
        project_id: { type: Schema.ObjectId, ref:     'Project' },
		funded: 	{ type: Number,          default: 0         },
		user_id: 	{ type: Schema.ObjectId, ref:     'User'    }
});

// <---- Methods ---->

// create the model for users and expose it to our app
module.exports = mongoose.model('Backer', backerSchema);
