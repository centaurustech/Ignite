/// <reference path="../../../typings/angularjs/angular.d.ts"/>

/**
 * Angular Module and Controller for index.html
 */
(function() {
	var app = angular.module('Ignite', ["ProjectService"]);
	
	app.controller("IndexController", ["$scope", "Project", function($scope, Project) {
		$scope.HelloWorld = "Hello World!";
		
		$scope.GetProject = function() {
			// Retrive the response object
			var ret = Project.get();
			
			// Asynchronously await for the data to be returned
			// and assign it to the HelloWorld variable.
			ret.success(function(data) {
				$scope.HelloWorld = data;	
			});
			
		};
		
		
		$scope.moduleState = "index";
		
	}]);

})();
