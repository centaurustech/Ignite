// <---- Required Modules ---->
var mongoose = require('mongoose');

// <---- Schema ---->
var userSchema = mongoose.Schema({
        user_name: 	 	 String,
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





// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
