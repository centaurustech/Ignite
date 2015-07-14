/// <reference path="../../typings/angularjs/angular.d.ts"/>
/**
 * Angular factory used for all CRUD operations for the MoProjectdel model.
 * This module can be included into any other module as a dependency, 
 * the factory associated with this module is used for the CRUD operations.
 */ 
angular.module('ProjectService', []).factory('Project', ['$http', '$rootScope', function($http, $rootScope) {

    return {
        // call to get all projects
        get : function() {
            return $http.get('/api/project');
        },
        
        post : function(project, image) {
            
            var formData = new FormData();
            formData.append('user', angular.toJson($rootScope.user));
            formData.append('file', image);
            formData.append('project', angular.toJson(project));
            
	        return $http.post('/api/project', formData, {
	            transformRequest: angular.identity,
                headers: {'Content-Type': undefined}    // required, in order to set to multipart
	        });
        },
        
        getById : function(id) {
            return $http.get('/api/project/' + id);
        },
        
        addBacker : function(projectId, userId, fundAmount) {
            return $http.post('/api/project/' + projectId + 
                              '/add_backer?backer_id=' + userId + 
                              '&funded=' + fundAmount);
        },
        
        addFollower : function(projectId, userId) {
            return $http.post('/api/project/' + projectId +
                              '/add_follower?user_id=' + userId);
        },
        
        // get all categories
        getCategories: function() {
            return $http.get('/api/project/categories');
        },
        
        // get all categories
        getCities: function() {
            return $http.get('/api/project/cities');
        }
    };       

}]);