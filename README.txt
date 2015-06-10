Ignite web application built by Alex Tang for innnovate@HSBC's crowd funding initiative.


// ==================================================================
// 				Instructions On Running The Application 
// ==================================================================

1. Install node.js - https://nodejs.org/
2. Install bower   - http://bower.io/
3. Change directory into the root of the project (Ignite)
4. Run 'npm install' to install all dependencies for the node server
5. Run 'bower install' to install all of the dependencies for the client side
6. Run 'npm start' to run the application locally on port 3000.

// ==================================================================
//			 			Directory Structure 
// ==================================================================

Ignite/
- bower_components/		    > front end dependencies (angular, bootstrap, etc).
- node_modules/			    > node dependency modules
- public/					> static files served to the client
---- images/
---- javascripts/
------ controllers/			> angular modules/controllers for web pages
------ directives/			> all directives pertaining to the web pages
------ services/			> angular factories used in controllers for RESTful calls to the server
- routes/					> routing for all urls including api calls
---- api/					> user defined modules for mongodb operations
- typings/					> typescript files for Visual Studio Code Intellisense
- views/					> all html files pertaining to the website
- app.js					> initialization code for express.js




// ==================================================================
//			 					Log 
// ==================================================================

Tue Jun 9 => 4 hours.