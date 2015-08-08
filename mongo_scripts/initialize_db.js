var conn = new Mongo();
var db = conn.getDB("ignite");

// Populate categories
var categories = ["Technology", "Business", "Security", "Operations"];

for (var i = 0; i < categories.length; i++) {
    db['categories'].insert({
        "name": categories[i],
        "project_ids": []
    });
}

var categoryIDs = [];
cursor = db['categories'].find();
while (cursor.hasNext()) {
    categoryIDs.push(cursor.next()._id);
}

