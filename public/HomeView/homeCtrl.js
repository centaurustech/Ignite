/**
 * Angular Module and Controller for HomeView Partial
 */
(function() {
	var app = angular.module('HomeControllers', 
		[
			"UserService",
			"ProjectService",
			"angularModalService"
		]);
	
	app.controller("HomeController", ["$scope", "Project", function($scope, Project) {	
		$scope.$on('$viewContentLoaded', function(){
		    angular.element(document.querySelector('#fullpage'))
				.fullpage(
					{
						paddingTop: '85px',
						paddingBottom: '10px',
						normalScrollElements: '#project-gallery, .modal'
					}
				);
		});
		
		$scope.scrollDown = function() {
			$.fn.fullpage.moveSectionDown();
		};
		
	}]);
	
	/* Carousel Directive and Controller */
	app.directive('carousel', function() {
  		return {
			restrict: 'E',
    		templateUrl: 'HomeView/directives/carousel.html',
			controller: 'CarouselCtrl'
  		};
	});
	
	app.controller('CarouselCtrl', ["$scope", "$location", "Project", function($scope, $location, Project) {
		$scope.projects;
		
		Project.get().success(function(data) {
			$scope.projects = data;	
		});
	}]);
	
	
	/* Categories Directive and Controller */
	app.directive('categories', function() {
		return {
			restrict: 'E',
    		templateUrl: 'HomeView/directives/categories.html',
			controller: 'CategoriesCtrl'
  		};
	});
	
	app.controller('CategoriesCtrl', ["$scope", "Project", function($scope, Project) {
		$scope.categories;
		
		Project.getCategories().success(function(data) {
			$scope.categories = data;
		});
		
	}]);
	
	
	/* Project Gallery Directive and Controller */
	app.directive('projectGallery', function() {
		return {
			restrict: 'E',
    		templateUrl: 'HomeView/directives/projectGallery.html',
			controller: 'ProjectGalleryCtrl'
  		};
	});
	
	app.controller('ProjectGalleryCtrl', ["$scope", "Project", "$timeout", "ModalService", function($scope, Project, $timeout, ModalService) {
		$scope.projects;
		$scope.categories;
		$scope.showFilters = false;
		$scope.categoryFilterId = "";
		$scope.orderByFilter = "";
		
		// Retrieve projects
		Project.get().success(function(data) {
			$scope.projects = data;	
			
			$scope.projects.forEach(function(project) {
				var days_left = (new Date(project.end_date).getTime() - new Date().getTime()) / 1000 / 60 / 60 / 24;
				project.days_left = project.is_in_progress ? days_left : 0;
			});
		});
		
		Project.getCategories().success(function(data) {
			$scope.categories = data;
		});
		
		$scope.setCategoryFilter = function(category) {
			$scope.categoryFilterId = category._id;
		};
		
		// Set the order filter on a property. If it is already selected, reverse the order.
		$scope.setOrderFilter = function(orderBy) {
			var orderField = orderBy;
			var is_desc = false;
			if($scope.orderByFilter != "" && $scope.orderByFilter[0] === '-') {
				is_desc = true;
				orderField = orderBy.slice(0);
			}
			if($scope.orderByFilter === orderField || $scope.orderByFilter === "-" + orderField) {
				$scope.orderByFilter = is_desc ? orderField : "-" + orderField;
			} else {
				$scope.orderByFilter = "-" + orderBy;	
			}
		};
		
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
	
	app.filter('categoryFilter', function() {
		return function(projects, categoryId) {
			if(categoryId === "") {
				return projects;
			}
			
			var resultProjects = [];
			for(var i = 0; i < projects.length; i++) {
				if(projects[i].category._id === categoryId) {
					resultProjects.push(projects[i]);
				}
			}
			return resultProjects;
		};
	})
	
	/* Footer directive */
	app.directive('hsbcFooter', function() {
		return {
			restrict: 'E',
			templateUrl: 'HomeView/directives/hsbcFooter.html',
		};
	});
})();
