/// <reference path="../typings/mocha/mocha.d.ts"/>
var should = require("should");
var mongoose = require('mongoose');
var User = require("../server/db/user");

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
        var user = new User({
            username: '12345',
            password: 'testy'
        });

        user.save(function(error) {
            if (error) console.log('error' + error.message);
            done();
        });
    });
    	
    // Verify that the user input in the beforeEach has been added to the database.
    it('find a user by username', function(done) {
        User.findOne({ username: '12345' }, function(err, account) {
            account.username.should.eql('12345');
            done();
        });
    });

    // Run after each test
    afterEach(function(done) {
        User.remove({}, function() {
            done();
        });
     });

});