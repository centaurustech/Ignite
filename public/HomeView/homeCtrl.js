/**
 * Angular Module and Controller for HomeView Partial
 */
(function() {
	var app = angular.module('HomeControllers', 
		[
			"UserService",
			"ProjectService"
		]);
	
	app.controller("HomeController", ["$scope", "Project", function($scope, Project) {	
		
		
	}]);
	
	/* Carousel Directive and Controller */
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
	
	
	/* Expires Soon Directive and Controller */
	app.directive('expiresSoon', function() {
		return {
			restrict: 'E',
    		templateUrl: 'HomeView/directives/expiresSoon.html',
			controller: 'ExpiresSoonCtrl'
  		};
	});
	
	app.controller('ExpiresSoonCtrl', ["$scope", "Project", function($scope, Project) {
		$scope.projects;
		$scope.displayNumber = 4;
		
		Project.get().success(function(data) {
			$scope.projects = data;	
		});
		
		$scope.incrementDisplayNumber = function() {
			$scope.displayNumber += 4;	
		};
	}]);
	
	/* Funded Directive and Controller */
	app.directive('funding', function() {
		return {
			restrict: 'E',
    		templateUrl: 'HomeView/directives/funding.html',
			controller: 'FundingCtrl'
  		};
	});
	
	app.controller('FundingCtrl', ["$scope", "Project", function($scope, Project) {
		$scope.projects;
		$scope.displayNumber = 4;
		
		Project.get().success(function(data) {
			$scope.projects = data;	
		});
		
		$scope.incrementDisplayNumber = function() {
			$scope.displayNumber += 4;	
		};
	}]);
	
	/* Near Complete Directive and Controller */
	app.directive('nearComplete', function() {
		return {
			restrict: 'E',
    		templateUrl: 'HomeView/directives/nearComplete.html',
			controller: 'NearCompleteCtrl'
  		};
	});
	
	app.controller('NearCompleteCtrl', ["$scope", "Project", function($scope, Project) {
		$scope.projects;
		$scope.displayNumber = 4;
		
		Project.get().success(function(data) {
			$scope.projects = data;	
		});
		
		$scope.incrementDisplayNumber = function() {
			$scope.displayNumber += 4;	
		};
	}]);
	
	

})();
