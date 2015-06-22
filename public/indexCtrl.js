/**
 * Angular Module and Controller for mainView.html
 */
(function() {
	var app = angular.module('Ignite',
	 	[
		 "ngRoute",
		 "UserService",
		 "HomeControllers"
		 ]);
	
	
	app.config(["$routeProvider",
		function($routeProvider) {
			$routeProvider
				.when('/homeView', {
					templateUrl: 'HomeView/homeView.html',
					controller: 'HomeController'
				})
				.when('/profileView', {
					templateUrl: 'ProfileView/profileView.html'
				})
				.otherwise({
					redirectTo: '/homeView'
				});
		}
	]);
	
	app.controller("IndexController", ["$scope", "User", function($scope, User) {
		$scope.user;
		User.getCurrentUser().success(function(data) {
			$scope.user = data;
		});
	}]);

})();
