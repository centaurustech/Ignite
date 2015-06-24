var User = require("../../server/db/user");

/** 
 * Basic user.
 */
module.exports.BasicUser = function() {
	return new User( {
            		username: 	 	 "BasicUser",
					first_name:  	 "Basic",
					last_name: 	 	 "User",
					image:			 "/assets/images/default_user_image.png",
					title: 		 	 "User",
					department:  	 "Testing",
					location:	 	 "Test Folder",
					email: 		 	 "test@me.com",
					is_budget_owner: true,
					is_approver: 	 true,
					followers:		 []
            	});
};