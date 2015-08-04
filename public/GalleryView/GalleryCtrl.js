/**
 * Angularjs module for the Project Gallery.
 * 
 * The project gallery houses all of the projects which have been submitted to the app.
 * They can be filtered and sorted on.
 * 
 */
(function() {
    var app = angular.module('GalleryControllers', [
        "UserService",
        "ProjectService"
    ]);

    /**
     * Controller for ProjectGallery.html
     * 
     * ProjectGallery.html is a view that gets swapped into ng-view in index.html.
     * When a project title is clicked on, a modal is displayed for that project.
     */
    app.controller('ProjectGalleryCtrl', ["$scope", "$rootScope", "Project", "ModalService", 
        function($scope, $rootScope, Project, ModalService) {
            
            $scope.projects;                    // array, All Projects
            
            $scope.categories;                  // array, All Categories
            $scope.categoryFilterId = "";       // string, database id of the category to filter on.
    
            // The criteria that that the projects are sorted on.
            $scope.orderByFilters = [{          
                filter_name: 'follower_count',              // property of a project to sort on
                display_name: 'Endorsers',                  // text to display on the filter bar
                svg_name: "Star",                           // name of the image for the icon (needed to change from black to white).
                image: "/assets/icons/card-icons/Starw.svg" // default image for the icon
            }, {
                filter_name: 'days_left',
                display_name: 'Days Left',
                svg_name: "Clock",
                image: "/assets/icons/card-icons/Clockw.svg"
            }, {
                filter_name: 'funded',
                display_name: 'Funded',
                svg_name: "Fund",
                image: "/assets/icons/card-icons/Fundw.svg"
            }];
            $scope.orderByFilter = "";          // string, (one of orderByFilters.filter_name) used to sort on criteria.
            
            // Ascending and Descending options for the filter bar.
            $scope.filterOrders = [{
                    display_name: "Ascending",              // text to display on the filter bar
                    svg_name: "Ascending",                  // name of the image for the icon (needed to change from black to white)
                    order_name: 'ascending',                // name to switch on to determine if ascending or descending clicked.
                    image: "/assets/icons/category-icons/Ascendingw.svg"
                }, {
                    display_name: "Descending",
                    svg_name: "Descending",
                    order_name: 'descending',
                    image: "/assets/icons/category-icons/Descending.svg"
            }]
            $scope.isAscending = true;          // boolean, true if sorting in ascending order
            
            
            /**
             * Retrieve all of the projects that have been approved from the server.
             * Assigns the retrieved projects to $scope.projects
             */
            Project.getApprovedProjects().success(function(data) {
                $scope.projects = data;
                
                // TODO: refactor this method out.
                $scope.projects.forEach(function(project) {
                    var days_left = Math.floor((new Date(project.end_date).getTime() - new Date(project.start_date).getTime()) / 1000 / 60 / 60 / 24);
                    project.days_left = days_left > 0 ? days_left : 0;
                    project.follower_count = project.followers.length;
                    project.background_color = $scope.selectColorByCategory(project.category.name);
                    project.starImage = "/assets/icons/card-icons/Starw.svg";
                    project.viewStarImage = "/assets/buttons/project-view/endorse.svg";
                    project.isFollowed = false;
                    project.followers.forEach(function(follower) {
                        if (follower === $rootScope.user._id) {
                            project.isFollowed = true;
                            project.starImage = "/assets/icons/card-icons/Star.svg";
                            project.viewStarImage = "/assets/icons/card-icons/Star.svg";
                        }
                    });
    
                });
            });
            
            /**
             * Retrieve all of the project categories from the server.
             * Assign the image property of the category for the filter bar.
             * It defaults to white, but can get swapped to black.
             */
            Project.getCategories().success(function(data) {
                $scope.categories = data;
                $scope.categories.forEach(function(category) {
                    category.image = "/assets/icons/category-icons/" + category.name + "w.svg";
                });
            });
            
            /**
             * Retrieve the correct color for the category.
             * Parameter category_name:
             *  - the name of the category.
             */
            $scope.selectColorByCategory = function(category_name) {
                var name_lower = String(category_name).toLowerCase();
                switch (name_lower) {
                    case "technology":
                        return "#A796B8";
                    case "business":
                        return "#69A9BC";
                    case "operations":
                        return "#C5AA8B";
                    case "security":
                        return "#8ABD9B";
                    default:
                        return "smokewhite";
                }
            }
            
            /**
             * Changes the categoryFilterId which the projects are filtered on.
             * Update the image of category filters.
             * Triggered when a category filter icon is pressed.
             * 
             * Parameter - category
             *  - the specific category object in $scope.categories
             * Parameter - index
             *  - index of category in $scope.categories
             */
            $scope.setCategoryFilter = function(category, index) {
                // Reset all the category icons to white.
                $scope.categories.forEach(function(category) {
                    category.image = "/assets/icons/category-icons/" + category.name + "w.svg";
                });
                
                // Show all categories if it was already selected
                if (category._id === $scope.categoryFilterId) {
                    $scope.categoryFilterId = "";
                } else {
                    $scope.categoryFilterId = category._id;
                    $scope.categories[index].image = "/assets/icons/category-icons/" + category.name + ".svg";
                }
            };
    
    
            

    
            /** 
             * Set the order filter on a property. If it is already selected, reverse the order.
             * Triggered when a OrderBy icon is clicked.
             * Updates the icons to reflect selection.
             * 
             * Parameters
             *      orderBy - one of the js objects in $scope.orderByFilters
             *      index   - the index of the object in $scope.orderByFilters
             */ 
            $scope.setOrderFilter = function(orderBy, index) {
                // Reset all of the icons back to white
                $scope.orderByFilters.forEach(function(orderBy) {
                    orderBy.image = "/assets/icons/card-icons/" + orderBy.svg_name + "w.svg";
                });
                // Reset all of the sorting if it is the same icon that is clicked.
                if (orderBy === $scope.orderByFilter || "-" + orderBy == $scope.orderByFilter) {
                    $scope.orderByFilter = "";
                } else {
                    $scope.orderByFilter = $scope.isAscending ? "-" + orderBy : orderBy;
                    $scope.orderByFilters[index].image = "/assets/icons/card-icons/" + $scope.orderByFilters[index].svg_name + ".svg";
                }
            };
    

            /**
             * Set either ascending or descending order
             * Triggered when either the ascending or descending button is clicked.
             * Updates the icons
             * 
             * Parameters
             *      order - one of the js objects in $scope.filterOrders
             *      index - the index of order in $scope.filterOrders
             */
            $scope.setOrder = function(order, index) {
                // Clicking the same one.
                if ((order === 'descending' && $scope.isAscending) || (order === 'ascending' && !$scope.isAscending)) {
                    return;
                }
                // Reset both icons back to white
                $scope.filterOrders.forEach(function(filterOrder) {
                    filterOrder.image = "/assets/icons/category-icons/" + filterOrder.svg_name + "w.svg";
                });
                // Currently in descending, change to ascending.
                if (order === 'descending' && !$scope.isAscending) {
                    $scope.orderByFilter = $scope.orderByFilter.replace('-', '');
                    $scope.isAscending = true;
                    $scope.filterOrders[index].image = "/assets/icons/category-icons/" + $scope.filterOrders[index].svg_name + ".svg";
                } else
                // Currently in ascending, change to descending.
                if (order === 'ascending' && $scope.isAscending) {
                    $scope.orderByFilter = "-" + $scope.orderByFilter;
                    $scope.isAscending = false;
                    $scope.filterOrders[index].image = "/assets/icons/category-icons/" + $scope.filterOrders[index].svg_name + ".svg";
                }
            }
    
            /**
             * Add the current user logged in ($rootScope.user) as a follower to the project
             * in $scope.projects[index]
             */
            $scope.followProject = function(index) {
                if ($scope.filteredProjects[index].isFollowed) {
                    swal("You've already endorsed this project!");
                } else {
                    Project.addEndorser($scope.filteredProjects[index]._id, $rootScope.user._id)
                        .success(function(data) {
                            $scope.filteredProjects[index].isFollowed = true;
                            $scope.filteredProjects[index].starImage = "/assets/icons/card-icons/Star.svg";
                            swal("Thanks for the support!", "You just endorsed this project!", "success");
                        });
                }
            }
            
            /**
             * Open the projectView modal that shows the fully detailed project submission.
             * It also sends the projects which have been filtered on to the modal.
             * The sent projects are used for the carousel.
             */
            $scope.openProject = function(projectId, index) {
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
                    modal.element.modal({});
                    modal.close.then(function(result) {
    
                    });
                });
            };
    }]); // ProjectGalleryCtrl END.

    // Custom filter to filter based on category_id.
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
    });

})();
