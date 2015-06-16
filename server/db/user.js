// <---- Required Modules ---->
var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

// <---- Schema ---->
var userSchema = mongoose.Schema({
        username: 	 	 String,
		password: 	 	 String,
		first_name:  	 String,
		last_name: 	 	 String,
		title: 		 	 String,
		department:  	 String,
		description: 	 String,
		email: 		 	 String,
		is_budget_owner: Boolean,
		is_approver: 	 Boolean
});


// <---- Methods ---->

// Include the passport plugin to allow this model to be used as the authentication model.
userSchema.plugin(passportLocalMongoose);

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
