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
        
        register : function(registerForm) {
			return $http.post('/api/user/register', {
    				'username':        registerForm.username,
    				'password':        registerForm.password,
    				'first_name':      registerForm.first_name,
    				'last_name':       registerForm.last_name,
    				'title':           registerForm.title,
    				'department':      registerForm.department,
    				'location':        registerForm.location,
    				'email':           registerForm.email,
    				'is_budget_owner': registerForm.is_budget_owner,
    				'is_approver':     registerForm.is_approver
    			});
        },
        
        getProjects : function(user_id) {
            return $http.get('/api/user/projects/' + user_id);
        },
        
        // Logout the current user.
        logout : function() {
            return $http.post('/api/user/logout');
        }   
    };   
}]);