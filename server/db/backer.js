// <---- Required Modules ---->
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

// <---- Schema ---->
var backerSchema = mongoose.Schema({
        project_id: { type: Schema.ObjectId, ref:     'project' },
		funded: 	{ type: Number,          default: 0     },
		user_id: 	{ type: Schema.ObjectId, ref:     'user'    }
});

// <---- Methods ---->

// create the model for users and expose it to our app
module.exports = mongoose.model('Backer', backerSchema);
