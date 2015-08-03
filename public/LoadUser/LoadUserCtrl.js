/// <reference path="../../typings/angularjs/angular.d.ts"/>

/**
 * Angular Module and Controller for /users/register
 */
(function() {
    var app = angular.module('LoadUserControllers', 
        [
            'UserService'        
        ]);


    app.controller("LoginController", ["$scope", "$http", "$window", 'User', function($scope, $http, $window, User) {
        $scope.form = {}; // Login Form
        $scope.message; // Error Message

        // Function for login button.
        $scope.login = function() {
            var username = $scope.form.username;
            var password = $scope.form.password;

            User.login(username, password)
                .error(function(data) {
                    $scope.message = data;
                }).success(function(data) {
                    $window.location.href = '/';
                });
        };
    }]);
    
     app.controller("RegisterController", ["$scope", "$http", "$window", "User", function($scope, $http, $window, User) {
        $scope.form = {};
        $scope.message;

        // TODO: Move to UserService
        $scope.register = function() {

            User.register($scope.form)
                .error(function(data) {
                    $scope.message = data;
                }).success(function(data) {
                    $window.location.href = '/';
                });
        };

    }]);

})();
