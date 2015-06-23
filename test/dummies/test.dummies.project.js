var Project = require("../../server/db/project.js");

/** 
 * Basic project resembles a skeleton project for testing.
 * No ObjectId references should be filled in.
 * - Nothing funded
 * - No Resources
 * - Not Approved
 * - No Category 
 * - No Backers
 * - No Creator
 * - No Comments
 * - No Team Members
 * - No City
 * - No Followers
 */

module.exports.BasicProject = function() {
	return new Project( {
            		image:              "/image_url",
                    title:              "",
                    start_date:         new Date(),
                    end_date:           new Date(),
                    budget:             1000000,
                    funded:             0,
                    resources:          [],
                    description:        "Description",
                    budget_breakdown:   "Budget Break Down",
                    challenges:         "Challenges",
                    value_proposition:  "Value Proposition",
                    is_approved:        false,
                    category:           "",
                    backers:            [],
                    creator:            "",
                    comments:           [],
                    team_members:       [],
                    city:               "",
                    followers:          [],
                    is_in_progress:     true
            	});
}