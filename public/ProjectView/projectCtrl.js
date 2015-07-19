/**
 * Angular Module and Controller for HomeView Partial
 */
(function() {
	var app = angular.module('ProjectControllers', 
		[
			"UserService",
			"ProjectService"
		]);
	
	app.controller("ProjectController", 
		["$scope", "$rootScope", "$location", "Project", "FilteredProjects", "Index", "IsPreview", "close", 
		function($scope, $rootScope, $location, Project, FilteredProjects, Index, IsPreview, close) {	
		
		// If it is a preview, it must be prepopulated with default values.
		if(IsPreview === true) {
			FilteredProjects[0].category = (FilteredProjects[0].category ? {name: String(FilteredProjects[0].category)} : {name: "Technology"});
			FilteredProjects[0].funded = 0;
			FilteredProjects[0].days_left = 0;
			FilteredProjects[0].followers = [];
			FilteredProjects[0].backers = [];
			FilteredProjects[0].image = "/assets/images/default_project_image.jpg";
			FilteredProjects[0].budget = (FilteredProjects[0].budget ? FilteredProjects[0].budget : 0);
			FilteredProjects[0].start_date = (FilteredProjects[0].start_date ? new Date() : 0);
		}
		
		$scope.filteredProjects = FilteredProjects;
		$scope.message;
		$scope.currentIndex = Index;
		$scope.slideIndex = Index;
		$scope.fundAmount;
		
		
		
		
		$scope.fundProject = function(project, index) {
			
			Project.addBacker(project._id, $rootScope.user._id, project.fundAmount).
				success(function(data) {
					// Update this project.
					var days_left = (new Date(data.end_date).getTime() - new Date().getTime()) / 1000 / 60 / 60 / 24;
					data.days_left = days_left > 0 ? days_left : 0;
					
					$scope.filteredProjects[index] = data;
				})
				.error(function(data) {
					$scope.message = data;
				});
		};
		
		$scope.slideLeft = function() {
			$scope.slideIndex === 0 ? $scope.filteredProjects.length - 1 : $scope.slideIndex--;
		}
		$scope.slideRight = function() {
			$scope.slideIndex === $scope.filteredProjects.length - 1 ? 0 : $scope.slideIndex++;
		}

		$scope.closeModalAndRedirect = function() {
			var url = "/profileView/" + $scope.filteredProjects[$scope.currentIndex].creator._id;
			$scope.dismissModal();
			$location.url(url);
		}
		
		 $scope.dismissModal = function(result) {
		    close(result); 
		 };
		 
 		$scope.followProject = function(projectId) {
			Project.addFollower(projectId, $rootScope.user._id)
				   .success(function(data) {});
		}
		
	}]);
	
	app.controller("CreateProjectCtrl", ["$scope", "$rootScope", "Project", "ModalService", "close", function($scope, $rootScope, Project, ModalService, close) {
		$scope.message;					// message to show the project is pending approval.
		$scope.form = {}; 				// initialize a blank project
		$scope.form.resources = [];		// initialize resources
		
		// Resource Form Fields
		$scope.resource_form_role;
		$scope.resource_form_description;
		
		// Retrieve the categories to select from
		$scope.categories;
		Project.getCategories().success(function(categories) {
			$scope.categories = categories;
		});
		
		// Retrieve the cities to select from
		$scope.cities;
		Project.getCities().success(function(cities) {
			$scope.cities = cities;
		});
		
		$scope.createProject = function() {
			var project_image = $scope.project_image;
			// Attach the project in the form and project_image to the POST request.
			Project.post($scope.form, project_image)
				.success(function(data) {
					$scope.message = "Thank you, your project is now pending approval";
				});
		};
		
		$scope.addResource = function() {
			$scope.form.resources.push({ role: $scope.resource_form_role, 
										 description: $scope.resource_form_description });
			$scope.resource_form_role = "";
			$scope.resource_form_description = "";
													 
		};
		
		$scope.openSubModal = function() {
		    ModalService.showModal({
			    templateUrl: 'ProjectView/projectView.html',
				controller: 'ProjectController',
				inputs: { FilteredProjects: [$scope.form], Index: 0, IsPreview: true }
		    }).then(function(modal) {
			    modal.element.modal({});
			    modal.close.then(function(result) {
			   	    
			    });
    		});
		};
		
		$scope.dismissModal = function(result) {
		    close(result); 
		 };
	}]);
	
	// App directive in order to parse the file uploaded.
	app.directive('fileModel', ['$parse', function ($parse) {
	    return {
	        restrict: 'A',
	        link: function(scope, element, attrs) {
	            var model = $parse(attrs.fileModel);
	            var modelSetter = model.assign;
	            
	            element.bind('change', function(){
	                scope.$apply(function(){
	                    modelSetter(scope, element[0].files[0]);
	                });
	            });
	        }
	    };
	}]);
	
})();
