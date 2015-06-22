/**
 * Angular factory used for all CRUD operations for the MoProjectdel model.
 * This module can be included into any other module as a dependency, 
 * the factory associated with this module is used for the CRUD operations.
 */ 
angular.module('ProjectService', []).factory('Project', ['$http', function($http) {

    return {
        // call to get
        get : function() {
            return $http.get('/api/project');
        },


        // these will work when more API routes are defined on the Node side of things
        // call to POST to create
        create : function(project) {
            return $http.post('/api/project', project);
        },

        // call to DELETE 
        delete : function(id) {
            return $http.delete('/api/project/' + id);
        }
    };       

}]);