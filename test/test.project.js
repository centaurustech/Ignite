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
var UserDummies    = require("./dummies/test.dummies.user");
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
   
    /**
     * [TEST]
     * Add a single backer
     */ 	
    it('should add a new backer to the project', function(done) {
        ProjectDummies.BasicProject().save(function(err, BasicProject) {    // Save BasicProject       
            UserDummies.BasicUser().save(function(err, BasicUser) {         // Save BasicUser
                var fundAmount = 1000;
        
                BasicProject.addBacker(BasicUser._id, fundAmount, function(err, project){   // Add BasicUser as Backer for BasicProject
                    // Verify that only one backer has been added.
                    project.backers.length.should.eql(1);  
                    
                    Backer.findOne({ "_id" : BasicProject.backers[0]}).populate('project_id user_id').exec(function(err, backer) {
                        // Check that the references are correct.
                        backer.project_id._id.should.eql(BasicProject._id);
                        backer.user_id._id.should.eql(BasicUser._id);
                        done();        
                    });
                });
            });
        });
        
    });
    
   /**
     * [TEST]
     * Add the same backer twice
     */ 	
    it('should add the same backer project, and take the sum as funded', function(done) {
        ProjectDummies.BasicProject().save(function(err, BasicProject) {    // Save BasicProject       
            UserDummies.BasicUser().save(function(err, BasicUser) {         // Save BasicUser
                var fundAmount = 1000;
        
                BasicProject.addBacker(BasicUser._id, fundAmount, function(err, project1){   // Add BasicUser as Backer for BasicProject
                    project1.addBacker(BasicUser._id, fundAmount, function(err, project2) {  // Add BasicUser again as Backer for BasicProject
                        // Verify that only one backer has been added.
                        project2.backers.length.should.eql(1);  
                        Backer.findOne({ "_id" : BasicProject.backers[0]})
                            .populate('project_id user_id').exec(function(err, backer) {

                                // Check that the references are correct.
                                
                                backer.project_id._id.should.eql(BasicProject._id);
                                backer.user_id._id.should.eql(BasicUser._id);
                                
                                // Check that the funds added have been summed.
                                backer.funded.should.equal(2000);
                                done();                            
                        });
                    });
                });        
            });  
        });
        
    });
    
   /**
     * [TEST]
     * Add two different backers to one project.
     */ 	
    it('should add two different backers to the same project', function(done) {
        ProjectDummies.BasicProject().save(function(err, BasicProject) {    // Save BasicProject       
            UserDummies.BasicUser().save(function(err, BasicUser) {         // Save BasicUser
                UserDummies.BasicUser().save(function(err, BasicUser2) {
                    var fundAmount = 1000;
        
                    BasicProject.addBacker(BasicUser._id, fundAmount, function(err, project1){   // Add BasicUser as Backer for BasicProject
                        project1.addBacker(BasicUser2._id, fundAmount, function(err, project2) {  // Add BasicUser2 as Backer for BasicProject
                            // Verify that only one backer has been added.
                            project2.backers.length.should.eql(2);  
                            
                            Backer.find({ "project_id" : BasicProject._id})
                                .populate('project_id user_id').exec(function(err, backers) {
                                    backers.length.should.eql(2);
                                    // Check that the references are correct.
                                    backers[0].project_id._id.should.eql(BasicProject._id);
                                    backers[0].user_id._id.should.eql(BasicUser._id);
                                    
                                    backers[1].project_id._id.should.eql(BasicProject._id);
                                    backers[1].user_id._id.should.eql(BasicUser2._id);
                                    
                                    // Check the individual funds
                                    backers[0].funded.should.equal(1000);
                                    backers[1].funded.should.equal(1000);
                                    
                                    // Check the total funds for BasicProject
                                    BasicProject.funded.should.equal(2000);
                                    done();                            
                            });
                        });
                    });        
                });  
            });
        });
                
    });
    
    
    /**
     * [TEST]
     * Add a single comment from one user
     */ 	
    it('should add a new comment to the project', function(done) {
        ProjectDummies.BasicProject().save(function(err, BasicProject) {    // Save BasicProject       
            UserDummies.BasicUser().save(function(err, BasicUser) {         // Save BasicUser
                var userComment = "comment";

                BasicProject.addComment(BasicUser._id, userComment, function(err, project){   // Add comment from BasicUser for BasicProject
                    // Verify that only one backer has been added.
                    project.comments.length.should.eql(1);  
                    
                    Comment.findOne({ "_id" : BasicProject.comments[0]})
                        .populate('project_id user_id').exec(function(err, comment) {
                            // Check that the references are correct.
                            comment.project_id._id.should.eql(BasicProject._id);
                            comment.user_id._id.should.eql(BasicUser._id);
                            
                            // Check that the comment is correct
                            comment.comment.should.eql(userComment);
                            done();       
                    });
                });
            });
        });
        
    });
    
   /**
     * [TEST]
     * Add two comments from the same user
     */ 	
    it('should add two new comments to the same project', function(done) {
        ProjectDummies.BasicProject().save(function(err, BasicProject) {    // Save BasicProject       
            UserDummies.BasicUser().save(function(err, BasicUser) {         // Save BasicUser
               var userComment = "comment";
    	       var userComment2 = "comment2";
                BasicProject.addComment(BasicUser._id, userComment, function(err, project){   // Add comment from BasicUser for BasicProject
                    project.addComment(BasicUser._id, userComment2, function(err, project){   // Add comment from BasicUser for BasicProject
                        // Verify that only one backer has been added.
                        project.comments.length.should.eql(2);  

                        Comment.find({ "project_id" : BasicProject._id})
                            .populate('project_id user_id').exec(function(err, comments) {

                            // Check that the references are correct    
                            comments[0].project_id._id.should.eql(BasicProject._id);
                            comments[0].user_id._id.should.eql(BasicUser._id);
                            
                            comments[1].project_id._id.should.eql(BasicProject._id);
                            comments[1].user_id._id.should.eql(BasicUser._id);
                            
                            // Check that the comment is correct
                            comments[0].comment.should.eql(userComment);
                            comments[1].comment.should.eql(userComment2);      
                            
                            done();
                        });
                    });
                });
            });
        }); 
    });
    
    /**
     * [TEST]
     * Add two comments from the different users
     */ 	
    it('should add two new comments to the same project', function(done) {
        ProjectDummies.BasicProject().save(function(err, BasicProject) {    // Save BasicProject       
            UserDummies.BasicUser().save(function(err, BasicUser) {         // Save BasicUser
               UserDummies.BasicUser().save(function(err, BasicUser2) {     // Save BasicUser2
                   var userComment = "comment";
        	       var userComment2 = "comment2";
                   BasicProject.addComment(BasicUser._id, userComment, function(err, project){   // Add comment from BasicUser for BasicProject
                        project.addComment(BasicUser2._id, userComment2, function(err, project){   // Add comment from BasicUser for BasicProject
                            // Verify that only one backer has been added.
                            project.comments.length.should.eql(2);  
                            
                            Comment.find({ "project_id" : BasicProject._id})
                                .populate('project_id user_id').exec(function(err, comments) {
    
                                // Check that the references are correct    
                                comments[0].project_id._id.should.eql(BasicProject._id);
                                comments[0].user_id._id.should.eql(BasicUser._id);
                                
                                comments[1].project_id._id.should.eql(BasicProject._id);
                                comments[1].user_id._id.should.eql(BasicUser2._id);
                                
                                // Check that the comment is correct
                                comments[0].comment.should.eql(userComment);
                                comments[1].comment.should.eql(userComment2);      
                                
                                done();
                             });
                        });
                    });
                }); 
            });
        });
    
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