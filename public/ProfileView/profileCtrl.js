/**
 * Angular Module and Controller for Profile View
 */
(function() {
    var app = angular.module('ProfileControllers', [
        "UserService",
        "ProjectService"
    ]);
    
    /**
     * ======================================================================
     * Controller for the ng-view profileView.html
     * profileView.html is displayed for any user, not just the current user. 
     * It is swapped into ng-view and shows project and user information.
     * ======================================================================
     */
    app.controller("ProfileController", ["$scope", "$rootScope", "Project", "$timeout", "User", "$routeParams", "ModalService",
        function($scope, $rootScope, Project, $timeout, User, $routeParams, ModalService) {
            
            $scope.filteredProjects;        // array, A subset of references to all projects, ones that show up in the filter.
            $scope.projects;                // array, All projects
            $scope.following;               // array, All Projects that the user has followed.

            $scope.showOwn = true;          // boolean, indicates whether we're showing followed projects (not creator's projects).

            $scope.user;                    // The user that is being viewed
            
            // The filters that are displayed in the filter bar.
            $scope.filters = [{     
                display_name: "In Progress",                            // Name to display under the icon
                image: "/assets/icons/card-icons/Inprogressw.svg",      // Icon to display in the filter bar
                svg_name: "Inprogress",                                 // Name of the svg used to change the color
                filter_name: "in_progress"                              // Name of the filter.
            }, {
                display_name: "Expired",
                image: "/assets/icons/card-icons/Expiredw.svg",
                svg_name: "Expired",
                filter_name: "expired"
            }, {
                display_name: "Fully Funded",
                image: "/assets/icons/card-icons/Fullyfundw.svg",
                svg_name: "Fullyfund",
                filter_name: "fully_funded"
            }, {
                display_name: "Endorsed",
                image: "/assets/icons/card-icons/Starw.svg",
                svg_name: "Star",
                filter_name: "endorsed"
            }];
            $scope.filterBy = "";           // String, filter string. used to filter on properties of projects.
            
            // Retrieve the user's information from the server.
            User.getUser($routeParams.userId)
                .success(function(data) {
                    $scope.user = data;
                });

            // Retrieve all of the projects that the viewed user has created.
            User.getProjects($routeParams.userId)
                .success(function(data) {
                    $scope.projects = data;

                    $scope.projects.forEach(function(project) {
                        var days_left = (new Date(project.end_date).getTime() - new Date().getTime()) / 1000 / 60 / 60 / 24;
                        project.days_left = days_left > 0 ? days_left : 0;
                        project.background_color = (project.category.name) ? String(project.category.name).toLowerCase() : "technology";

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
                
            // Retrieve all of the projects that the viewed user is following
            User.getEndorsedProjects($routeParams.userId)
                .success(function(data) {
                    $scope.following = data;

                    $scope.following.forEach(function(project) {
                        var days_left = (new Date(project.end_date).getTime() - new Date().getTime()) / 1000 / 60 / 60 / 24;
                        project.days_left = days_left > 0 ? days_left : 0;
                        project.background_color = (project.category.name) ? String(project.category.name).toLowerCase() : "technology";
                        
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
             * Open the project view modal for the selected project.
             * The modal is a carousel for all projects that are in filteredProjects.
             * Parameters -
             *      projectId: String, the id of the project to be viewed.
             *      index:     Number, the index of said project in it's respective array.
             */
            $scope.openProject = function(projectId, index) {
                ModalService.showModal({
                    templateUrl: 'ProjectView/projectView.html',
                    controller: 'ProjectController',
                    inputs: {
                        FilteredProjects: $scope.showOwn ? $scope.filteredProjects : $scope.following,
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



            $scope.setFilter = function(filter_name, index) {
                $scope.filters.forEach(function(filter) {
                    filter.image = "/assets/icons/card-icons/" + filter.svg_name + "w.svg";
                });

                if (filter_name === "endorsed") {
                    $scope.showOwn = false;
                } else {
                    $scope.showOwn = true;
                }
                $scope.filterBy = filter_name;
                $scope.filters[index].image = "/assets/icons/card-icons/" + $scope.filters[index].svg_name + ".svg";
            }
            
            /**
             * Allow the current user to follow this project.
             * Must fix bug: index is for filteredProjects, user could follow endorsed. return follow star back in endorsed view.
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
            
            $scope.followFollowedProject = function(index) {
                if ($scope.following[index].isFollowed) {
                    swal("You've already endorsed this project!");
                } else {
                    Project.addEndorser($scope.following[index]._id, $rootScope.user._id)
                        .success(function(data) {
                            $scope.following[index].isFollowed = true;
                            $scope.following[index].starImage = "/assets/icons/card-icons/Star.svg";
                            swal("Thanks for the support!", "You just endorsed this project!", "success");
                        });
                }
            }

        }
    ]);
    
    /**
     * Filter for filtering on properties. 
     * It takes in the filter string and returns all projects that correspond.
     */
    app.filter("projectFilter", function() {
        return function(projects, filterBy) {
            var resultProjects = [];

            switch (filterBy) {
                case 'in_progress':
                    for (var i = 0; i < projects.length; i++) {
                        if ((new Date(projects[i].end_date)) >= (new Date)) {
                            resultProjects.push(projects[i]);
                        }
                    }
                    break;
                case 'expired':
                    for (var i = 0; i < projects.length; i++) {
                        if ((new Date(projects[i].end_date)) < (new Date)) {
                            resultProjects.push(projects[i]);
                        }
                    }
                    break;
                case 'fully_funded':
                    for (var i = 0; i < projects.length; i++) {

                        if (projects[i].funded >= projects[i].budget) {
                            console.log("funded: %s, budget: %s", projects[i].funded, projects[i].budget);
                            resultProjects.push(projects[i]);
                        }
                    }
                    break;
                default:
                    return projects;
                    break;
            }
            return resultProjects;
        }
    });
})();
