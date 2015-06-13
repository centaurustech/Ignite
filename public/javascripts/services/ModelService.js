/// <reference path="../../../typings/angularjs/angular.d.ts"/>
/**
 * Angular factory used for all CRUD operations for the Model model.
 * This module can be included into any other module as a dependency, 
 * the factory associated with this module is used for the CRUD operations.
 */ 
angular.module('ModelService', []).factory('Model', ['$http', function($http) {

    return {
        // call to get
        get : function() {
            return $http.get('/api/model');
        },


        // these will work when more API routes are defined on the Node side of things
        // call to POST to create
        create : function(nerdData) {
            return $http.post('/api/model', nerdData);
        },

        // call to DELETE 
        delete : function(id) {
            return $http.delete('/api/model/' + id);
        }
    };       

}]);