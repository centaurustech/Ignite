/** 
 * All urls that start with '/api/dev' will route to this module.
 * 
 */
var express = require('express');
var router = express.Router();
var app = express();

var mongoose = require('mongoose');

var Project = require('../../db/project');

// populate projects
// drop database

/**
 * Drop the projects collection, it is a GET to use the current user.
 */
router.get('/dev/dropProjects', function(req, res) {
   mongoose.connection.collections['projects'].drop( function(err) {
        res.send("Projects Dropped");
   });
});

module.exports = router;