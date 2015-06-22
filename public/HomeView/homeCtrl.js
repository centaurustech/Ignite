/**
 * Angular Module and Controller for HomeView Partial
 */
(function() {
	var app = angular.module('HomeControllers', 
		[
			"UserService",
			"ProjectService"
		]);
	
	app.controller("HomeController", ["$scope", "$location", "User", "$window", function($scope, $location, User, $window) {	
		
		
	}]);
	
	
	
	app.directive('carousel', function() {
  		return {
			restrict: 'E',
    		templateUrl: 'HomeView/directives/carousel.html',
			controller: 'CarouselCtrl'
  		};
	});
	
	app.controller('CarouselCtrl', ["$scope", "Project", function($scope, Project) {
		$scope.projects;
		
		Project.get().success(function(data) {
			$scope.projects = data;	
		});
		
	}]);

})();
