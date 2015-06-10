/// <reference path="../../../typings/angularjs/angular.d.ts"/>

/**
 * Angular Module and Controller for index.html
 */
(function() {
	var app = angular.module('Ignite', ["ModelService"]);
	
	
	
	app.controller("IndexController", ["$scope", "Model", function($scope, Model) {
		$scope.HelloWorld = "Hello World!";
		
		$scope.GetModel = function() {
			// Retrive the response object
			var ret = Model.get();
			
			// Asynchronously await for the data to be returned
			// and assign it to the HelloWorld variable.
			ret.success(function(data) {
				console.log(data);
				$scope.HelloWorld = data;	
			});
			
		};
	}]);

})();
