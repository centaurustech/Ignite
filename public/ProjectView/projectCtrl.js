/**
 * Angular Module and Controller for HomeView Partial
 */
(function() {
	var app = angular.module('ProjectControllers', 
		[
			"UserService",
			"ProjectService"
		]);
	
	app.controller("ProjectController", ["$scope", "$routeParams", "Project", function($scope, $routeParams, Project) {	
		// Retrieve the parameter /projectView/:id id
		$scope.projectId = $routeParams.projectId;
		
		$scope.project;
		
		Project.getById($scope.projectId).success(function(data) {
			$scope.project = data;
		});
		
	}]);
	
	
})();
