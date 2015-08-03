/**
 * Angular Module and Controller for HomeView Partial
 */
(function() {
    var app = angular.module('IndexControllers', [
        "UserService",
        "ProjectService"
    ]);
    
    /* Carousel Directive and Controller */
    app.directive('carousel', function() {
        return {
            restrict: 'E',
            templateUrl: 'HomeView/directives/carousel.html',
            controller: 'CarouselCtrl'
        };
    });
    
})();
