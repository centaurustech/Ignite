/** 
 * All urls that start with 'api/' will route to this module.
 * 
 */

var express = require('express');
var router = express.Router();

// Dependencies for the api calls. These dependencies are user defined modules
// that are used for all database operations
var ModelService = require('./api/ModelService');

/* Simple GET operation on Model model */
router.get('/model', function(req, res, next) {
  
  var response = ModelService.get();
  res.send(response);
  
});

module.exports = router;