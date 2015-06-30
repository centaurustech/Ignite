/**
 * Angular Module and Controller for Profile partial
 */
(function() {
	var app = angular.module('ProfileControllers', 
		[
			"UserService",
			"ProjectService"
		]);
	
	app.controller("ProfileController", ["$scope", "$rootScope","User", function($scope, $rootScope, User) {	
		$scope.projects;
		User.getProjects($rootScope.user._id)
			.success(function(data) {
				$scope.projects = data;
			});
	}]);
	
	
})();
