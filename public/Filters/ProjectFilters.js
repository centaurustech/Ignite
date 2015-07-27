var projectFilters = angular.module('ProjectFilters', []);

projectFilters.filter('expiry', function() {
    return function(input) {
        input = new Date(input) || '';
        var out = "";
        for (var i = 0; i < input.length; i++) {
            out = input.charAt(i) + out;
        }
        return out;
    };
});
