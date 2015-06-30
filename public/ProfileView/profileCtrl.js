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
		
	}]);
	
	/* Approved Projects Directive and Controller */
	app.directive('approvedProjects', function() {
		return {
			restrict: 'E',
    		templateUrl: 'ProfileView/directives/approvedProjects.html',
			controller: 'ApprovedProjectsCtrl'
  		};
	});
	
	app.controller('ApprovedProjectsCtrl', ["$scope", "$rootScope","User", function($scope, $rootScope, User) {
		$scope.approvedProjects;
		User.getProjects($rootScope.user._id)
			.success(function(data) {
				$scope.approvedProjects = data;
			});
	}]);
	
	/* Pending Projects Directive and Controller */
	app.directive('pendingProjects', function() {
		return {
			restrict: 'E',
    		templateUrl: 'ProfileView/directives/pendingProjects.html',
			controller: 'PendingProjectsCtrl'
  		};
	});
	
	app.controller('PendingProjectsCtrl', ["$scope", "$rootScope","User", function($scope, $rootScope, User) {
		$scope.pendingProjects;
		User.getPendingProjects($rootScope.user._id)
			.success(function(data) {
				$scope.pendingProjects = data;
			});
	}]);
	
	
})();
