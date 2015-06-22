
/**
 * Angular Module and Controller for /users/register
 */
(function() {
	var app = angular.module('RegisterControllers', []);
	

	app.controller("RegisterController", ["$scope","$rootScope", "$http", "$window", function($scope, $rootScope, $http, $window) {
		$scope.form = {};
		$scope.message;
		console.log("register Controller");
		
		// TODO: Move to UserService
		$scope.register = function() {
			console.log("register");
			$http.post('/api/user/register', {
				'username': $scope.form.username,
				'password': $scope.form.password,
				'first_name': $scope.form.first_name,
				'last_name': $scope.form.last_name,
				'title': $scope.form.title,
				'department': $scope.form.department,
				'location': $scope.form.location,
				'email': $scope.form.email,
				'is_budget_owner': $scope.form.is_budget_owner,
				'is_approver': $scope.form.is_approver
			}).error(function(data) {
				$scope.message = data;
			}).success(function(data) {
				$window.location.href = '/';
			});
			
		};
	}]);

})();
