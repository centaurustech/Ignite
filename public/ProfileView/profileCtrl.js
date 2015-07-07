/**
 * Angular Module and Controller for Profile partial
 */
(function() {
	var app = angular.module('ProfileControllers', 
		[
			"UserService",
			"ProjectService"
		]);
	
	app.controller("ProfileController", ["$scope", "$rootScope","User", "$routeParams", "ModalService",
				   function($scope, $rootScope, User, $routeParams, ModalService) {	
		$scope.filteredProjects;
		$scope.projects;
		$scope.following;
		
		$scope.showFilters = false;
		$scope.showOwn = true;
		$scope.filterBy = "";
		
		User.getProjects($routeParams.userId)
			.success(function(data) {
				$scope.projects = data;
		});
		
		User.getFollowedProjects($routeParams.userId)
			.success(function(data) {
				$scope.following = data;
		});
		
		$scope.dropDownClick = function() {
			$scope.showFilters = !$scope.showFilters;
		};
		
		$scope.openProject = function(projectId, index) {
		    ModalService.showModal({
			    templateUrl: 'ProjectView/projectView.html',
			    controller: 'ProjectController',
				inputs: { FilteredProjects: $scope.showOwn ? $scope.filteredProjects : $scope.following, Index: index }
		    }).then(function(modal) {
			    modal.element.modal({
					backdrop: 'static'
				});
			    modal.close.then(function(result) {
			   	    
			    });
    		});
		};
		
		$scope.setInProgress = function() {
			$scope.showOwn = true;
			$scope.filterBy = "inProgress";
		}
		
		$scope.setExpired = function() {
			$scope.showOwn = true;
			$scope.filterBy = "expired";
		}
		
		$scope.setFullyFunded = function() {
			$scope.showOwn = true;
			$scope.filterBy = "fullyFunded";
		}
		
		$scope.setFollowing = function() {
			$scope.showOwn = false;
		}
		
	}]);
	
	app.filter("projectFilter", function() {
		return function(projects, filterBy) {
			var resultProjects = [];
			
			switch(filterBy) {
				case 'inProgress': 
					for(var i = 0; i < projects.length; i++) {
						if((new Date(projects[i].end_date)) >= (new Date)) {
							resultProjects.push(projects[i]);
						}
					}
					break;
				case 'expired':
					for(var i = 0; i < projects.length; i++) {
						if((new Date(projects[i].end_date)) < (new Date)) {
							resultProjects.push(projects[i]);
						}
					}
					break;
				case 'fullyFunded':
					for(var i = 0; i < projects.length; i++) {
						
						if(projects[i].funded >= projects[i].budget) {
							console.log("funded: %s, budget: %s", projects[i].funded, projects[i].budget);
							resultProjects.push(projects[i]);
						}
					}
					break;
				default:
					return projects;
					break;
			}
			
			
			
			return resultProjects;
		}
	});
	
	
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
