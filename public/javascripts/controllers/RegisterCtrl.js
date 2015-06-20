/// <reference path="../../../typings/angularjs/angular.d.ts"/>

/**
 * Angular Module and Controller for /users/register
 */
(function() {
	var app = angular.module('Ignite', []);
	
	
	app.controller("RegisterController", ["$scope", "$http", "$window", function($scope, $http, $window) {
		$scope.form = {};
		$scope.message;
		
		this.register = function() {
			
			$http.post('/users/register', {
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
