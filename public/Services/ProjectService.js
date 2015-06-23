/**
 * Angular factory used for all CRUD operations for the MoProjectdel model.
 * This module can be included into any other module as a dependency, 
 * the factory associated with this module is used for the CRUD operations.
 */ 
angular.module('ProjectService', []).factory('Project', ['$http', function($http) {

    return {
        // call to get all projects
        get : function() {
            return $http.get('/api/project');
        },
        
        // get all categories
        getCategories: function() {
            return $http.get('/api/project/categories');
        }
    };       

}]);