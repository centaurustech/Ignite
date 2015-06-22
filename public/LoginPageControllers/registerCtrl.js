
/**
 * Angular Module and Controller for /users/register
 */
(function() {
	var app = angular.module('RegisterControllers', 
		[
			"UserService"
		]);
	

	app.controller("RegisterController", ["$scope", "$http", "$window", "User", function($scope, $http, $window, User) {
		$scope.form = {};
		$scope.message;
		console.log("register Controller");
		
		// TODO: Move to UserService
		$scope.register = function(){
			
			User.register($scope.form)
			.error(function(data) {
				$scope.message = data;
			}).success(function(data) {
				$window.location.href = '/';
			});
		};
			
	}]);
})();
