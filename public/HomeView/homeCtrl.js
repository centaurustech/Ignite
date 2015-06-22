/**
 * Angular Module and Controller for HomeView Partial
 */
(function() {
	var app = angular.module('HomeControllers', 
		[
			"UserService"
		]);
	
	app.controller("HomeController", ["$scope", "$location", "User", "$window", function($scope, $location, User, $window) {	
		
		
	}]);

})();
