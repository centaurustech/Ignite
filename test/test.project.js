/// <reference path="../typings/mocha/mocha.d.ts"/>
var should = require("should");
var mongoose = require('mongoose');

// Mongoose Models
var Backer   = require("../server/db/backer");
var Category = require("../server/db/category");
var City     = require("../server/db/city");
var Comment  = require("../server/db/comment");
var Project  = require("../server/db/project");
var Resource = require("../server/db/resource")
var User     = require("../server/db/user");


// Dummies for testing
var ProjectDummies = require("./dummies/test.dummies.project");

var db;

/**
 * Testing functionality of Project model.
 * There will be no equality check for members of the project model not under test.
 *      Eg. Test adding a backer will not check for equality in city, followers, image, etc.
 * 
 * The reason is due to changing members as requirements change.
 */
describe('Project', function() {
    // Run before the entire suite of tests
    before(function(done) {
        db = mongoose.connect('mongodb://localhost/test');
            done();
    });
    
    // Run after the entire suite of tests
    after(function(done) {
        mongoose.connection.close();
        done();
    });
    
    // Run before each test
    beforeEach(function(done) {
        done();
    });
    	
    // Verify that the user input in the beforeEach has been added to the database.
    it('should add a new backer to the project', function(done) {
        var BasicProject = ProjectDummies.BasicProject();
        BasicProject.title.should.eql('');
        done();
    });

    // Run after each test
    afterEach(function(done) {
        // Drop all collections
        Backer.remove({}, function() {
            Category.remove({}, function() {
                City.remove({}, function() {
                    Comment.remove({}, function() {
                        Project.remove({}, function() {
                            Resource.remove({}, function() {
                                User.remove({}, function() {
                                    done();
                                });
                            });
                        });
                    });
                });
            });
        });
     });

});