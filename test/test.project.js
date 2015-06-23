/// <reference path="../typings/mocha/mocha.d.ts"/>
var should = require("should");
var mongoose = require('mongoose');

var Backer   = require("../server/db/backer");
var Category = require("../server/db/category");
var City     = require("../server/db/city");
var Comment  = require("../server/db/comment");
var Project  = require("../server/db/project");
var Resource = require("../server/db/resource")
var User     = require("../server/db/user");

var db;

describe('User', function() {
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

    });
    	
    // Verify that the user input in the beforeEach has been added to the database.
    it('should add a new backer to the project', function(done) {
        User.findOne({ username: '12345' }, function(err, account) {
            account.username.should.eql('12345');
            done();
        });
    });

    // Run after each test
    afterEach(function(done) {
        // Drop all collections
        Backer.remove({}, function() {
            done();
        });
        Category.remove({}, function() {
            done();
        });
        City.remove({}, function() {
            done();
        });
        Comment.remove({}, function() {
            done();
        });
        Project.remove({}, function() {
            done();
        });
        Resource.remove({}, function() {
            done();
        });
        User.remove({}, function() {
            done();
        });
     });

});