/// <reference path="../../typings/angularjs/angular.d.ts"/>
/**
 * Angular factory used for all CRUD operations for the MoProjectdel model.
 * This module can be included into any other module as a dependency, 
 * the factory associated with this module is used for the CRUD operations.
 */ 
angular.module('UserService', []).factory('User', ['$http', function($http) {
    
    return {
        // Get the current logged in user
        getCurrentUser : function() {
            return $http.get('/api/user/currentUser');
        },
    	
        // Login with credentials
        login : function(username, password) {
            return $http.post('/api/user/login', {
                'username': username,
                'password': password
            });
		},
        
        // Logout the current user.
        logout : function() {
            return $http.post('/api/user/logout');
        }   
    };   
}]);