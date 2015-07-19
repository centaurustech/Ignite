var conn = new Mongo();
var db = conn.getDB("ignite");

var loremIpsum1 = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

var loremIpsum2 = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.";

var loremIpsum3 = "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.";

var loremIpsum4 = "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?";

var projectImage = "/assets/images/default_project_image.jpg";

var admin_id;

var cursor = db['users'].find({username: "Employee1"});
while(cursor.hasNext()) {
    admin_id = cursor.next()._id;
}


// Populate categories
var categories = ["Technology", "Business", "Security", "Operations"];

for(var i = 0; i < categories.length; i++) {
    db['categories'].insert(
        {
          "name": categories[i],
          "project_ids": []  
        }
    );
}

var categoryIDs = [];
cursor = db['categories'].find();
while(cursor.hasNext()) {
    categoryIDs.push(cursor.next()._id);
}

var cities = ["Vancouver", "Seattle", "Cairo", "Burnaby"];

for(var i = 0; i < cities.length; i++) {
    db['cities'].insert(
        {
            "name": cities[i],
            "project_ids": []
        }
    );
}

var cityIDs = [];
cursor = db['cities'].find();
while(cursor.hasNext()) {
    cityIDs.push(cursor.next()._id);
}



for(var i = 1; i <= 20; i++) {
    var start_date = new Date();
        start_date.setDate(i);
        
    var end_date = new Date();
        end_date.setDate(i + 1);
        
	db['projects'].insert(
		{ "image":              projectImage,
          "title":              "Project #" + i,
          "start_date":         start_date,
          "end_date":           end_date,
          "budget":             (Math.random() * 100000).toFixed(0),
          "funded":             0,
          "resources":          [],
          "summary":            loremIpsum1,
          "description":        loremIpsum1,
          "challenges":         loremIpsum3,
          "value_proposition":  loremIpsum4,
          "is_approved":        (Math.random() < 0.5 ? true : false ),
          "category":           categoryIDs[(Math.floor(Math.random() * ( 1 + (categoryIDs.length - 1) - 0 ) ) + 0)],
          "backers":            [],
          "creator":            admin_id,
          "comments":           [],
          "team_members":       [],
          "city":               cityIDs[(Math.floor( Math.random() * ( 1 + (cityIDs.length - 1) - 0 ) ) + 0)],
          "followers":          [],
          "country":            "",
          "is_in_progress":     (Math.random() < 0.5 ? true : false ),
		});	
}

