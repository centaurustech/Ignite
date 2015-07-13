/**
 * Angular Module and Controller for mainView.html
 */
(function() {
	var app = angular.module('Ignite',
	 	[
		 "ngRoute",
		 "UserService",
		 "HomeControllers",
		 "ProjectControllers",
		 "ProfileControllers",
		 "ProjectFilters",
		 "ngAnimate",
		 "angularModalService"
		 ]);
	
	
	app.config(["$routeProvider",
		function($routeProvider) {
			$routeProvider
				.when('/homeView', {
					templateUrl: 'HomeView/homeView.html',
					controller: 'HomeController'
				})
				.when('/profileView/:userId', {
					templateUrl: 'ProfileView/profileView.html',
					controller: 'ProfileController'
				})
				.when('/projectView/:projectId', {
					templateUrl: 'ProjectView/projectView.html',
					controller: 'ProjectController'
				})
				.when('/createProject/', {
					templateUrl: 'ProjectView/createProjectView.html',
					controller: 'CreateProjectCtrl'
				})
				.otherwise({
					redirectTo: '/homeView'
				});
		}
	]);
	
	app.run(function($rootScope) {
	    angular.element(document.querySelector('#fullpage'))
			.fullpage(
				{
					paddingTop: '85px',
					paddingBottom: '10px',
					normalScrollElements: '#project-gallery, .modal, #profileView, .navbar, #fullpage, .footer',
				}
			);
			
			$rootScope.$on('$viewContentLoaded', function() {
				
			});
	});
	
	app.controller("IndexController", ["$scope","$rootScope", "User", "$window", function($scope, $rootScope, User, $window) {
		$rootScope.user = null;
		
		// Check if the visitor is logged in.
		User.getCurrentUser().success(function(data) {			
			if(data) {
				// If there is a currentUser, then assign it to the root scope user
				// to be used in child scopes.
				$rootScope.user = data;
			}
			// Redirect to login page if they are not logged in.
			if(!$rootScope.user) {
				$window.location.href="/login.html";
			}
		});
		
		
		
		// logout function for the logout button
		$scope.logout = function() {
			User.logout().success(function(data) {
				$window.location.href="/login.html";
			});
		};
		
		// Scrolling for two main sections
		$scope.screen = "down";
		$scope.scroll = function() {
			if($scope.screen === "down") {
				$scope.screen = "up";
				$.fn.fullpage.moveSectionDown();
			} else {
				$scope.screen = "down";
				$.fn.fullpage.moveSectionUp();
			}
		};
		
		// Scroll Down 
		$scope.scrollDown = function() {
			$.fn.fullpage.moveSectionDown();
			$scope.screen = "up";
		}
	}]);

})();
