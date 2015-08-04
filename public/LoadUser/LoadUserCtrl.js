/**
 * Angular Module and Controllers for the loadUserView.html
 * 
 * loadUserView.html is also it's own page, it does not act as a single page application (ng-view) and
 * is not actually a part of the web application.
 * 
 * loadUserView.html is only loaded if the user has not logged in through Single Sign On at HSBC.
 * The point of this view is to allow users to register and login with custom accounts outside of the
 * HSBC intranet. They can register and input the same fields that users with SSO would automatically give.
 */
(function() {
    var app = angular.module('LoadUserControllers', [
        'UserService'
    ]);

    /**
     * Controller for the login section of the page.
     */
    app.controller("LoginController", ["$scope", "$http", "$window", 'User', 
        function($scope, $http, $window, User) {
        
            $scope.form = {}; // JS Object, Login Form
            $scope.message;   // String,    Error Message
    
            /**
             * Log the user in with the credentials in the form.
             */ 
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
    
    /**
     * Controller for the registration section of the page.
     * Once the user has registered, they will be redirected to the main page
     * of the web application.
     */
    app.controller("RegisterController", ["$scope", "$http", "$window", "User", 
        function($scope, $http, $window, User) {
            
            $scope.form = {}; // JS Object, Login Form
            $scope.message;   // String,    Error Message
    
            /**
             * Register the user with the information in the form.
             * Only the username needs to be unique.
             */
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
