// <---- Required Modules ---->
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

// <---- Schema ---->
var userSchema = mongoose.Schema({
		employee_id:     { type: String,   default: ""     									}, 
        username: 	 	 { type: String,   default: ""    								    }, 
		full_name:		 { type: String,   default: "" 										},
		first_name:  	 { type: String,   default: ""    							        }, 
		last_name: 	 	 { type: String,   default: ""    							        }, 
		image:			 { type: String,   default: "http://api.adorable.io/avatars/100/" + String(Math.random() * 100) }, 
		title: 		 	 { type: String,   default: ""    							        }, 
		department:  	 { type: String,   default: "" 	  							        }, 
		location:	 	 { type: String,   default: ""    							        }, 
		email: 		 	 { type: String,   default: ""    	       						    }, 
		phone:			 { type: String,   default: "+1 798-987-9283"						},
		is_budget_owner: { type: Boolean,  default: false 		           					}, 
		is_approver: 	 { type: Boolean,  default: false 							        }, 
		following:		 { type: [Schema.ObjectId], ref: 'Project'						    }, 
		projects:		 { type: [Schema.ObjectId], ref: 'Project'							},
		funded:          { type: [Schema.ObjectId], ref: 'Project'							}
});


// <---- Methods ---->

// Include the passport plugin to allow this model to be used as the authentication model.
userSchema.plugin(passportLocalMongoose);

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
