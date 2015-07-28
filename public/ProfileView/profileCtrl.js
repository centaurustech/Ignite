/**
 * Angular Module and Controller for Profile partial
 */
(function() {
    var app = angular.module('ProfileControllers', [
        "UserService",
        "ProjectService"
    ]);

    app.controller("ProfileController", ["$scope", "$rootScope", "Project", "$timeout", "User", "$routeParams", "ModalService",
        function($scope, $rootScope, Project, $timeout, User, $routeParams, ModalService) {
            $scope.filteredProjects;
            $scope.projects;
            $scope.following;

            $scope.showFilters = false;
            $scope.showOwn = true;
            $scope.filterBy = "";

            User.getUser($routeParams.userId)
                .success(function(data) {
                    console.log(data);
                    $scope.user = data;
                });


            User.getProjects($routeParams.userId)
                .success(function(data) {
                    $scope.projects = data;

                    $scope.projects.forEach(function(project) {
                        var days_left = (new Date(project.end_date).getTime() - new Date().getTime()) / 1000 / 60 / 60 / 24;
                        project.days_left = days_left > 0 ? days_left : 0;
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

            $scope.selectColorByCategory = function(category_name) {
                var name_lower = String(category_name).toLowerCase();
                switch (name_lower) {
                    case "technology":
                        return "#b1b1a6";
                    case "business":
                        return "#53a6be";
                    case "operations":
                        return "#acadbf";
                    case "security":
                        return "#6fbac0";
                    default:
                        return "smokewhite";
                }
            }

            User.getFollowedProjects($routeParams.userId)
                .success(function(data) {
                    $scope.following = data;

                    $scope.following.forEach(function(project) {
                        var days_left = (new Date(project.end_date).getTime() - new Date().getTime()) / 1000 / 60 / 60 / 24;
                        project.days_left = days_left > 0 ? days_left : 0;
                        project.background_color = $scope.selectColorByCategory(project.category.name);
                    });
                });

            $scope.dropDownClick = function() {
                $scope.showFilters = !$scope.showFilters;
            };

            $scope.openProject = function(projectId, index) {
                ModalService.showModal({
                    templateUrl: 'ProjectView/projectView.html',
                    controller: 'ProjectController',
                    inputs: {
                        FilteredProjects: $scope.showOwn ? $scope.filteredProjects : $scope.following,
                        Index: index,
                        IsPreview: false
                    }
                }).then(function(modal) {
                    modal.element.modal({
                        //backdrop: 'static'
                    });
                    modal.close.then(function(result) {

                    });
                });
            };

            $scope.setInProgress = function() {
                $scope.showOwn = true;
                $scope.filterBy = "inProgress";
            }

            $scope.setExpired = function() {
                $scope.showOwn = true;
                $scope.filterBy = "expired";
            }

            $scope.setFullyFunded = function() {
                $scope.showOwn = true;
                $scope.filterBy = "fullyFunded";
            }

            $scope.setFollowing = function() {
                $scope.showOwn = false;
            }
            /*
            var isFilterVisible = true;
            // Hide the filter after 4 seconds
            var to = $timeout(function() {
                $('#user-filters').addClass("height-zero", 1000);
                $('#user-filters').children().hide();
                isFilterVisible = false;
            }, 4000);

            // If the filters are hidden, display the filters
            $scope.showFilters = function() {
                $timeout.cancel(to);
                if (!isFilterVisible) {
                    $('#user-filters').removeClass("height-zero", 10);
                    $('#user-filters').children().show();
                    isFilterVisible = true;
                }
            };

            // If the filters are shown, hide them after 2 seconds
            $scope.hideFilters = function() {
                if (isFilterVisible) {
                    to = $timeout(function() {
                        $('#user-filters').addClass("height-zero", 1000);
                        $('#user-filters').children().hide();
                        isFilterVisible = false;
                    }, 1000);
                }
            }
            */
            
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

        }
    ]);

    app.filter("projectFilter", function() {
        return function(projects, filterBy) {
            var resultProjects = [];

            switch (filterBy) {
                case 'inProgress':
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
                case 'fullyFunded':
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


    /* Approved Projects Directive and Controller */
    app.directive('approvedProjects', function() {
        return {
            restrict: 'E',
            templateUrl: 'ProfileView/directives/approvedProjects.html',
            controller: 'ApprovedProjectsCtrl'
        };
    });

    app.controller('ApprovedProjectsCtrl', ["$scope", "$rootScope", "User", function($scope, $rootScope, User) {
        $scope.approvedProjects;
        User.getProjects($rootScope.user._id)
            .success(function(data) {
                $scope.approvedProjects = data;
            });
    }]);

    /* Pending Projects Directive and Controller */
    app.directive('pendingProjects', function() {
        return {
            restrict: 'E',
            templateUrl: 'ProfileView/directives/pendingProjects.html',
            controller: 'PendingProjectsCtrl'
        };
    });

    app.controller('PendingProjectsCtrl', ["$scope", "$rootScope", "User", function($scope, $rootScope, User) {
        $scope.pendingProjects;
        User.getPendingProjects($rootScope.user._id)
            .success(function(data) {
                $scope.pendingProjects = data;
            });
    }]);


})();
