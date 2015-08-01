// <---- Required Modules ---->
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

// <---- Schema ---->
var userSchema = mongoose.Schema({
		employee_id:     { type: String,   default: ""     									}, // new
        username: 	 	 { type: String,   default: ""    								    }, // remove
		first_name:  	 { type: String,   default: ""    							        }, // keep
		last_name: 	 	 { type: String,   default: ""    							        }, // keep
		image:			 { type: String,   default: "http://api.adorable.io/avatars/100/" + String(Math.random() * 100) }, // keep
		title: 		 	 { type: String,   default: ""    							        }, // keep (job_role)
		department:  	 { type: String,   default: "" 	  							        }, // keep
		location:	 	 { type: String,   default: ""    							        }, // keep (country)
		email: 		 	 { type: String,   default: ""    	       						    }, // keep
		is_budget_owner: { type: Boolean,  default: false 		           					}, // keep
		is_approver: 	 { type: Boolean,  default: false 							        }, // keep
		following:		 { type: [Schema.ObjectId], ref: 'Project'						    }, 
		projects:		 { type: [Schema.ObjectId], ref: 'Project'							},
		funded:          { type: [Schema.ObjectId], ref: 'Project'							}
});


// <---- Methods ---->
//userSchema.methods.populateAll = function(callback) {
//     var schema = this;
//     schema.populate({path:'projects',  model: 'Project'}, 
//                     function(err, user) {
//                           return callback(err, user);
//                     });    
//};

// Include the passport plugin to allow this model to be used as the authentication model.
userSchema.plugin(passportLocalMongoose);

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
