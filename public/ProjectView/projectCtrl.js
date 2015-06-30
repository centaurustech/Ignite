/**
 * Angular Module and Controller for HomeView Partial
 */
(function() {
	var app = angular.module('ProjectControllers', 
		[
			"UserService",
			"ProjectService"
		]);
	
	app.controller("ProjectController", ["$scope", "$rootScope", "$routeParams", "Project", function($scope, $rootScope, $routeParams, Project) {	
		// Retrieve the parameter /projectView/:id id
		$scope.projectId = $routeParams.projectId;
		$scope.project;
		$scope.message;
		
		$scope.fundAmount;
		
		Project.getById($scope.projectId).success(function(data) {
			$scope.project = data;
		});
		
		
		
		$scope.fundProject = function() {
			$scope.project.funded += +$scope.fundAmount;
			Project.addBacker($scope.projectId, $rootScope.user._id, $scope.fundAmount).
				success(function(data) {
					$scope.project = data;
				})
				.error(function(data) {
					$scope.message = data;
				});
			
		};
		
	}]);
	
	app.controller("CreateProjectCtrl", ["$scope", "$rootScope", "Project", function($scope, $rootScope, Project) {
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
					console.log("successfully created project");
					
				});
		};
		
		$scope.addResource = function() {
			$scope.form.resources.push({ role: $scope.resource_form_role, 
										 description: $scope.resource_form_description });
			$scope.resource_form_role = "";
			$scope.resource_form_description = "";
													 
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
