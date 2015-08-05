/**
 * Angularjs module for all the controllers that belong to the admin pages.
 */
(function() {
    var app = angular.module('AdminControllers', [
        "UserService",
        "ProjectService",
        "angularModalService"
    ]);
    
    /**
     * =======================================================================
     * Controller for approveView.html
     * 
     * approveView is the html swapped into ng-view to show the administrators
     * all of the projects which have not been approved, it also allows them to
     * approve of projects and set the start date for funding.
     * ========================================================================
     */
    app.controller("ApproveCtrl", ["$scope", "$rootScope", "Project", "User", "$routeParams", "ModalService",
        function($scope, $rootScope, Project, User, $routeParams, ModalService) {
 
            $scope.projects;            // array, all non-approved projects. Empty if administrator is not authenticated.
            $scope.verified = false;    // boolean, whether or not the administrator has been verified.
            
            /**
             * Move the page down as soon as it is loaded
             * so that the authentication is in view.
             */
            $scope.$on('$viewContentLoaded', function() {
                $.fn.fullpage.moveSectionDown();
            });
            
            /**
             * Called when the administrator presses the 'show' button.
             * Calls to the server to retrieve all of the projects that have not been approved 
             * and assigns them to $scope.projects.
             * It also sends along the password and verification is done at the server side.
             * If the password is incorrect, null is returned as well as a HTTP 400 message.
             */
            $scope.tryPassword = function() {

                Project.getNonApproved($scope.password)
                    .success(function(data) {
                        $scope.verified = true;

                        $scope.projects = data;
                        
                        // TODO: Refactor into it's own method.
                        $scope.projects.forEach(function(project) {
                            var days_left = (new Date(project.end_date).getTime() - new Date().getTime()) / 1000 / 60 / 60 / 24;
                            project.days_left = days_left > 0 ? days_left : 0;
                            project.follower_count = project.followers.length;
                            project.background_color = String(project.category.name).toLowerCase();
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
            }
            
            /**
             * Parameter: Index 
             *  - Index of the project clicked in $scope.projects
             * 
             * This method will call out to the server and set a project
             * as approved. Once approved, the project will be deleted
             * from this view and will show up in the non-administrator pages.
             */
            $scope.approveProject = function(index) {
                swal({
                        title: "Approve",
                        text: "When will funding start?",
                        type: "input",
                        inputType: "date",
                        showCancelButton: true,
                        closeOnConfirm: false,
                        animation: "slide-from-top"
                    },
                    function(start_date) {
                        // start_date is the value entered prompt.
                        if (start_date === false) {
                            return false;
                        }
                        if (start_date === "") {
                            alert("C'mon, insert a date.");
                        } else {
                            Project.approveProject($scope.projects[index]._id, start_date)
                                .success(function(data) {
                                    swal("You have approved the project!");
                                    // Remove the project from $scope.projects
                                    if (index > -1) {
                                        $scope.projects.splice(index, 1);
                                    }
                                });
                        }
                    })
            };

            /**
             * Given the name of the category, return the corresponding color
             * that is associated with it.
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
             * Display a modal that allows the administrator to preview the project.
             */
            $scope.openProject = function(projectId, index) {
                ModalService.showModal({
                    templateUrl: 'ProjectView/projectView.html',
                    controller: 'ProjectController',
                    inputs: {
                        FilteredProjects: $scope.projects,
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

        }
    ]);  // ApproveCtrl END.



    /**
     * =======================================================================
     * Controller for usersView.html
     * 
     * usersView is the html swapped into ng-view to show the administrators
     * all of the users that have registered with the system. The registered users
     * are any users that have visited the website.
     * 
     * users can be either budget owners or not. This view allows the adminstrators
     * to set a user as a budget owner which will allow them to start funding projects.
     * ========================================================================
     */
    app.controller("UsersViewCtrl", ["$scope", "Project", "User", "$routeParams",
        function($scope, Project, User, $routeParams) {
            
            $scope.verified;    // boolean, if the administrator has authenticated with the correct password.
            $scope.users;       // array, all the users registered in the system. Empty if not verified.
            $scope.query;       // string, search query for users
            
            /**
             * Move the page down as soon as it is loaded
             * so that the authentication is in view.
             */
            $scope.$on('$viewContentLoaded', function() {
                $.fn.fullpage.moveSectionDown();
            });
    
            /**
             * Called when the administrator presses the 'show' button.
             * Calls to the server to retrieve all of the users that are registered in the system 
             * and assigns them to $scope.users.
             * 
             * It also sends along the password and verification is done at the server side.
             * If the password is incorrect, null is returned as well as a HTTP 400 message.
             */
            $scope.tryPassword = function() {
                    User.getAllUsers($scope.password)
                        .success(function(data) {
                            $scope.verified = true;
                            $scope.users = data;
                        });
            }
            
            /**
             * Parameter: index
             *  - index of the user to be made into a budget owner in $scope.users
             * 
             * Call to the server and set the user to be a budget owner if they are not already.
             * Budget owners can start funding and will see the fund button on project pages.
             */
            $scope.makeBudgetOwner = function(index) {
                User.makeBudgetOwner($scope.users[index]._id)
                    .success(function(user) {
                        $scope.users[index].is_budget_owner = user.is_budget_owner;
                    });
            }
        }
    ]); // UsersViewCtrl END.

})();
