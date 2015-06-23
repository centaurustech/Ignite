/**
 * Angular Module and Controller for Profile partial
 */
(function() {
	var app = angular.module('ProfileControllers', 
		[
			"UserService",
			"ProjectService"
		]);
	
	app.controller("ProfileController", ["$scope", function($scope, $routeParams, Project) {	
		
	}]);
	
	
})();
