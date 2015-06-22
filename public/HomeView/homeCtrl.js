/**
 * Angular Module and Controller for HomeView Partial
 */
(function() {
	var app = angular.module('HomeControllers', 
		[
			"UserService"
		]);
	
	app.controller("HomeController", ["$scope", "$location", "User", "$window", function($scope, $location, User, $window) {
		$scope.user = null;
		// Check if the visitor is logged in.
		User.getCurrentUser().success(function(data) {			
			if(data) {
				$scope.user = data;
			}
			// Redirect to login page if they are not logged in.
			if(!$scope.user) {
				$window.location.href="/login.html";
			}
		});
		
		// logout function for the logout button
		$scope.logout = function() {
			User.logout().success(function(data) {
				console.log($window);
				$window.location.href="/login.html";
			});
		};
		
	}]);

})();
