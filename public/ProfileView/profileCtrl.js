/**
 * Angular Module and Controller for Profile partial
 */
(function() {
	var app = angular.module('ProfileControllers', 
		[
			"UserService",
			"ProjectService"
		]);
	
	app.controller("ProfileController", ["$scope", "$rootScope","User", "$routeParams", function($scope, $rootScope, User, $routeParams) {	
		$scope.projects;
		$scope.categories;
		$scope.showFilters = false;
		
		User.getProjects($routeParams.userId)
			.success(function(data) {
				$scope.projects = data;
		});
		
		$scope.dropDownClick = function() {
			$scope.showFilters = !$scope.showFilters;
		};
		
		$scope.openProject = function(projectId, index) {
		    ModalService.showModal({
			    templateUrl: 'ProjectView/projectView.html',
			    controller: 'ProjectController',
				inputs: { FilteredProjects: $scope.filteredProjects, Index: index }
		    }).then(function(modal) {
			    modal.element.modal({
					backdrop: 'static'
				});
			    modal.close.then(function(result) {
			   	    
			    });
    		});
		};
		
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
