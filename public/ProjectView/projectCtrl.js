/**
 * Angular Module and Controller for HomeView Partial
 */
(function() {
	var app = angular.module('ProjectControllers', 
		[
			"UserService",
			"ProjectService"
		]);
	
	app.controller("ProjectController", ["$scope", "$rootScope", "$routeParams", "Project", function($scope, $rootScope, $routeParams, Project) {	
		// Retrieve the parameter /projectView/:id id
		$scope.projectId = $routeParams.projectId;
		$scope.project;
		$scope.message;
		
		$scope.fundAmount;
		
		Project.getById($scope.projectId).success(function(data) {
			$scope.project = data;
		});
		
		
		
		$scope.fundProject = function() {
			$scope.project.funded += +$scope.fundAmount;
			Project.addBacker($scope.projectId, $rootScope._id, $scope.fundAmount).
				success(function(data) {
					$scope.project = data;
				})
				.error(function(data) {
					$scope.message = data;
				});
			
		};
		
	}]);
	
	
})();
