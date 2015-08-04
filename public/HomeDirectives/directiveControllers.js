/**
 * Angularjs module for the all the directives respective controllers that will
 * be placed into the home page.
 */
(function() {
    var app = angular.module('IndexControllers', [
        "UserService",
        "ProjectService"
    ]);

    /* Featured Projects Carousel Directive */
    app.directive('carousel', function() {
        return {
            restrict: 'E',
            templateUrl: 'HomeDirectives/directives/carousel.html',
            controllerAs: 'CarouselCtrl'
        };
    });
    
    app.controller('CarouselCtrl', ["$scope", 
        function($scope){

        }
    ]);

})();
