/**
 * Angular Module and Controller for HomeView Partial
 */
(function() {
    var app = angular.module('HomeControllers', [
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

    app.controller('CarouselCtrl', ["$scope", "$location", "Project", function($scope, $location) {

    }]);


    /* Categories Directive and Controller */
    app.directive('categories', function() {
        return {
            restrict: 'E',
            templateUrl: 'HomeView/directives/categories.html',
            controller: 'CategoriesCtrl'
        };
    });

    app.controller('CategoriesCtrl', ["$scope", "Project", function($scope, Project) {
        $scope.categories;

        Project.getCategories().success(function(data) {
            $scope.categories = data;
        });

    }]);


    /* Project Gallery Directive and Controller */
    app.directive('projectGallery', function() {
        return {
            restrict: 'E',
            templateUrl: 'HomeView/directives/projectGallery.html',
            controller: 'ProjectGalleryCtrl'
        };
    });

    app.controller('ProjectGalleryCtrl', ["$scope", "$rootScope", "Project", "$timeout", "ModalService", function($scope, $rootScope, Project, $timeout, ModalService) {
        $scope.projects;
        $scope.categories;
        $scope.showFilters = false;
        $scope.categoryFilterId = "";
        

        // Retrieve projects
        Project.get().success(function(data) {
            $scope.projects = data;

            $scope.projects.forEach(function(project) {
                var days_left = Math.floor((new Date(project.end_date).getTime() - new Date(project.start_date).getTime()) / 1000 / 60 / 60 / 24);
                project.days_left = days_left > 0 ? days_left : 0;
                project.follower_count = project.followers.length;
                project.background_color = $scope.selectColorByCategory(project.category.name);
                project.starImage = "/assets/icons/card-icons/Starw.svg";
                project.viewStarImage = "/assets/buttons/project-view/endorse.svg";
                project.isFollowed = false;
                project.followers.forEach(function(follower) {
                    if(follower === $rootScope.user._id) {
                        project.isFollowed = true;
                        project.starImage = "/assets/icons/card-icons/Star.svg";
                        project.viewStarImage = "/assets/icons/card-icons/Star.svg";
                    }
                });
                
            });
        });

        Project.getCategories().success(function(data) {
            $scope.categories = data;
            $scope.categories.forEach(function(category) {
                category.image = "/assets/icons/category-icons/" + category.name + "w.svg";
            });
        });

        $scope.selectColorByCategory = function(category_name) {
            var name_lower = String(category_name).toLowerCase();
            switch (name_lower) {
				case "technology":  return "#A796B8";
				case "business":    return "#69A9BC";
				case "operations":  return "#C5AA8B";
				case "security":    return "#8ABD9B";
                default: return "smokewhite";
            }
        }

        $scope.setCategoryFilter = function(category, index) {
            $scope.categories.forEach(function(category) {
                category.image = "/assets/icons/category-icons/" + category.name + "w.svg";
            });
            if(category._id === $scope.categoryFilterId) {
                $scope.categoryFilterId = "";
            } else {
                $scope.categoryFilterId = category._id;
                $scope.categories[index].image = "/assets/icons/category-icons/" + category.name + ".svg";
            }
        };
        
        
        $scope.orderByFilter = "";
        $scope.orderByFilters = [
            { 
                filter_name : 'follower_count',
                display_name: 'Endorsers',
                svg_name: "Star",
                image   : "/assets/icons/card-icons/Starw.svg"  
            },
            { 
                filter_name : 'days_left',
                display_name: 'Days Left',
                svg_name: "Clock",
                image   : "/assets/icons/card-icons/Clockw.svg"  
            },
            { 
                filter_name : 'funded',
                display_name: 'Funded',
                svg_name: "Fund",
                image   : "/assets/icons/card-icons/Fundw.svg"  
            }
        ];

        // Set the order filter on a property. If it is already selected, reverse the order.
        $scope.setOrderFilter = function(orderBy, index) {
            $scope.orderByFilters.forEach(function(orderBy) {
                orderBy.image = "/assets/icons/card-icons/" + orderBy.svg_name + "w.svg";
            });
            
            if(orderBy === $scope.orderByFilter || "-" + orderBy == $scope.orderByFilter) {
                $scope.orderByFilter = "";
            } else {
                $scope.orderByFilter = $scope.isAscending ? "-" + orderBy : orderBy;                
                $scope.orderByFilters[index].image = "/assets/icons/card-icons/" + $scope.orderByFilters[index].svg_name + ".svg";  
            }
        };

        $scope.isAscending = true;
        $scope.filterOrders = [ 
            {
                display_name: "Ascending",
                svg_name: "Ascending",
                order_name: 'ascending',
                image : "/assets/icons/category-icons/Ascendingw.svg"
            },
            {
                display_name: "Descending",
                svg_name: "Descending",
                order_name: 'descending',
                image : "/assets/icons/category-icons/Descending.svg"
            }
        ]
        // Set either ascending or descending order
        $scope.setOrder = function(order, index) {
            // Clicking the same one.
            if( (order === 'descending' && $scope.isAscending) || (order === 'ascending' && !$scope.isAscending) ) {
                return;
            }
            
            $scope.filterOrders.forEach(function(filterOrder) {
                filterOrder.image = "/assets/icons/category-icons/" + filterOrder.svg_name + "w.svg";
            });
            // Currently in Descending
            if (order === 'descending' && !$scope.isAscending) {
                $scope.orderByFilter = $scope.orderByFilter.replace('-', '');
                $scope.isAscending = true;
                $scope.filterOrders[index].image = "/assets/icons/category-icons/" + $scope.filterOrders[index].svg_name + ".svg";
            } else
            // Currently in Ascending
            if (order === 'ascending' && $scope.isAscending) {
                $scope.orderByFilter = "-" + $scope.orderByFilter;
                $scope.isAscending = false;
                $scope.filterOrders[index].image = "/assets/icons/category-icons/" + $scope.filterOrders[index].svg_name + ".svg";
            } else {

            }
        }

        // Add the current user as a follower of the project at index.
        $scope.followProject = function(index) {
            if($scope.filteredProjects[index].isFollowed) {
                swal("You've already endorsed this project!");
            } else {
                Project.addFollower($scope.filteredProjects[index]._id, $rootScope.user._id)
                    .success(function(data) {
                        $scope.filteredProjects[index].isFollowed = true;
                        $scope.filteredProjects[index].starImage = "/assets/icons/card-icons/Star.svg";
                        swal("Thanks for the support!", "You just endorsed this project!", "success");
                    });
            }
        }

        /*
        var isFilterVisible = true;
        // Hide the filter after 6 seconds
        var to = $timeout(function() {
            $('#gallery-filters').addClass("height-zero", 1000);
            $('#gallery-filters').children().hide();
            isFilterVisible = false;
        }, 6000);

        // If the filters are hidden, display the filters
        $scope.showFilters = function() {
            $timeout.cancel(to);
            if (!isFilterVisible) {
                $('#gallery-filters').removeClass("height-zero", 10);
                $('#gallery-filters').children().show();
                isFilterVisible = true;
            }
        };

        // If the filters are shown, hide them after 2 seconds
        $scope.hideFilters = function() {
            if (isFilterVisible) {
                to = $timeout(function() {
                    $('#gallery-filters').addClass("height-zero", 1000);
                    $('#gallery-filters').children().hide();
                    isFilterVisible = false;
                }, 1000);
            }
        }
        */

        $scope.openProject = function(projectId, index) {
            console.log($scope.filteredProjects[index]);
            ModalService.showModal({
                templateUrl: 'ProjectView/projectView.html',
                controller: 'ProjectController',
                inputs: {
                    FilteredProjects: $scope.filteredProjects,
                    Index: index,
                    IsPreview: false,
                    Image: null
                }
            }).then(function(modal) {
                modal.element.modal({
                    //backdrop: 'static'
                });
                modal.close.then(function(result) {

                });
            });
        };
    }]);

    app.filter('categoryFilter', function() {
        return function(projects, categoryId) {
            if (categoryId === "") {
                return projects;
            }

            var resultProjects = [];
            for (var i = 0; i < projects.length; i++) {
                if (projects[i].category._id === categoryId) {
                    resultProjects.push(projects[i]);
                }
            }
            return resultProjects;
        };
    })

    /* Footer directive */
    app.directive('hsbcFooter', function() {
        return {
            restrict: 'E',
            templateUrl: 'HomeView/directives/hsbcFooter.html',
        };
    });
})();
