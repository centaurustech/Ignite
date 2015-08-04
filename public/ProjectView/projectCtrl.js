/**
 * Angular Module and Controller for HomeView Partial
 */
(function() {
    var app = angular.module('ProjectControllers', [
        "UserService",
        "ProjectService"
    ]);
    
    /**
     * =========================================================
     * Controller for the project view carousel modal.
     * The modal is a carousel that takes in FilteredProjects and 
     * allows the user to cycle through.
     * 
     * This page also allows users to comment, endorse, and fund.
     * =========================================================
     */
    app.controller("ProjectController", ["$scope", "$rootScope", "$location", "ModalService", "Project", "FilteredProjects", "Index", "IsPreview", "Image", "close",
        function($scope, $rootScope, $location, ModalService, Project, FilteredProjects, Index, IsPreview, Image, close) {

            // If it is a preview, it must be prepopulated with default values.
            if (IsPreview === true) {
                FilteredProjects[0].category.name = (FilteredProjects[0].category.name ? 
                    String(FilteredProjects[0].category.name)
                    :
                    "Technology"
                );
                FilteredProjects[0].background_color = "#A796B8";
                FilteredProjects[0].funded = 0;
                FilteredProjects[0].days_left = 0;
                FilteredProjects[0].followers = [];
                FilteredProjects[0].backers = [];
                FilteredProjects[0].budget = (FilteredProjects[0].budget ? FilteredProjects[0].budget : 0);
                FilteredProjects[0].start_date = (FilteredProjects[0].start_date ? new Date() : 0);
                FilteredProjects[0].creator = $rootScope.user;
                FilteredProjects[0].starImage = "/assets/icons/card-icons/Star.svg";
                FilteredProjects[0].viewStarImage = "/assets/icons/card-icons/Star.svg";
                FilteredProjects[0].image = Image ? URL.createObjectURL(Image) : "/assets/project_images/default_project_image.jpg"; 
                // Genereate a temporary URL from the uploaded image.
            }

            $scope.filteredProjects = FilteredProjects;     
            $scope.slideIndex = Index + 1               // Number, Index of the slide    
            $scope.currentIndex = Index;                // Number, Index of the project in filteredProjects   
            $scope.showSection = {                      // The sections below the separation bar which get swapped out
                showDetails: true,                      // set details as the default to be shown.
                showBackers: false,
                showComments: false,
            }    
            
            
            /**
             * Display a modal for funding the currently viewed project.
             * Triggered when the fundit button is pressed.
             */
            $scope.fund = function() {
                ModalService.showModal({
                    templateUrl: 'ProjectView/modals/FundModal.html',
                    controller: 'FundCtrl',
                    inputs: {
                        ProjectToFund: $scope.filteredProjects[$scope.currentIndex]
                    }
                }).then(function(modal) {
                    modal.element.modal({
                        backdrop: 'static'
                    });
                    // Set the z-indices for the black backgrounds.
                    $('.project-modal').css("z-index", 1050);
                    $('.modal-backdrop').css("z-index", 1060);
                    modal.close.then(function(result) {
                        $('.project-modal').css("z-index", 1075);
                        $('.modal-backdrop').css("z-index", 1049);
                    });
                });
            };
            
            /**
             * Add a comment to the current project.
             * Triggered when the add comment button is clicked.
             */
            $scope.addComment = function() {
                swal({
                        title: "Add a Comment",
                        text: "What would you like to say?",
                        type: "input",
                        showCancelButton: true,
                        closeOnConfirm: false,
                        animation: "slide-from-top",
                        inputPlaceholder: "Comment"
                    },
                    function(inputValue) {
                        if (inputValue === false) return false;
                        if (inputValue == "") {
                            swal.showInputError("Please Enter a Message");
                            return false;
                        }
                        Project.addComment($scope.filteredProjects[$scope.currentIndex]._id, $rootScope.user._id, inputValue)
                            .success(function(data) {
                                $scope.filteredProjects[$scope.currentIndex].comments = data;
                                swal("Nice!", "You just added a comment!", "success");
                            });
                    });
            };
            
            /**
             * Hide everything below the separation bar.
             */
            $scope.hideAllSections = function() {
                for (var key in $scope.showSection) {
                    if ($scope.showSection.hasOwnProperty(key)) {
                        $scope.showSection[key] = false;
                    }
                }
            }
            
            /**
             * Show the details section
             */
            $scope.showDetails = function(project) {
                $scope.hideAllSections();
                $scope.showSection["showDetails"] = true;
            };
            
            /**
             * Show the backers section
             */
            $scope.showBackers = function(project) {
                $scope.hideAllSections();
                $scope.showSection["showBackers"] = true;
            };
            
            /**
             * Show the comments section
             */
            $scope.showComments = function(project) {
                $scope.hideAllSections();
                $scope.showSection["showComments"] = true;
            };

            /**
             * Slide the carousel one slide left.
             */
            $scope.slideLeft = function() {
                $scope.currentIndex = ($scope.currentIndex === 0) ? $scope.filteredProjects.length - 1 : $scope.currentIndex - 1;
            };
            
            /**
             * Slide the carousel one slide right.
             */
            $scope.slideRight = function() {
                $scope.currentIndex = ($scope.currendIndex === $scope.filteredProjects.length - 1) ? 0 : $scope.currentIndex + 1;

            };
            
            /**
             * Close the modal and redirect to a different page.
             * Parameter
             *      url - the location to redirect to.
             */
            $scope.closeModalAndRedirect = function(url) {
                $scope.dismissModal();
                $location.url(url);
            }

            /**
             * Close the projectView modal.
             */
            $scope.dismissModal = function(result) {
                close(result);
            };

            /**
             * Call to the server to follow a project.
             * Parameter
             *      projectId - the _id of the project.
             */
            $scope.followProject = function(projectId) {
                var currentProject = $scope.filteredProjects[$scope.currentIndex];
                if (currentProject.isFollowed) {
                    swal("You've already endorsed this project!");
                } else {
                    currentProject.isFollowed = true;
                    Project.addEndorser(projectId, $rootScope.user._id)
                        .success(function(data) {
                            swal("Thanks for the support!", "You just endorsed this project!", "success");
                            FilteredProjects[$scope.currentIndex].starImage = "/assets/icons/card-icons/Star.svg";
                            $scope.filteredProjects[$scope.currentIndex].viewStarImage = "/assets/icons/card-icons/Star.svg";
                            $scope.filteredProjects[$scope.currentIndex].followers = data.followers;
                        });
                }
            }
        }
    ]); // ProjectController END.

    /**
     * ====================================================
     * Controller for FundModal.html.
     * 
     * This modal allows the user to fund a specific 
     * project indicated by ProjectToFund.
     * 
     * The user must type in their own correct employee ID
     * in order to fund the project.
     * 
     * This ID is not the _id in the database, it is 
     * assigned by HSBC. 
     * ====================================================
     */
    app.controller("FundCtrl", ["$scope", "$rootScope", "Project", "ProjectToFund", "close", 
        function($scope, $rootScope, Project, ProjectToFund, close) {

            $scope.project = ProjectToFund;
            $scope.message;
            $scope.accepted = "false";
            
            /**
             * Triggered when the user presses the FUNDIT button.
             * It will update the message at the bottom depending on
             * the inputs on the form. 
             */
            $scope.fundProject = function(project, fundAmount) {
                // Ensure the user has accepted the terms
                if ($scope.accepted === "false") {
                    $scope.message = "Please accept the terms.";
                    return;
                }
                // Ensure the user has entered the correct employee id
                if ($scope.employee_id === $rootScope.user.employee_id) {
                    $scope.message = "Your employee id is incorrect.";
                    return;
                }
                // Ensure the user has funded a value greater than 0
                if ($scope.fund_amount <= 0 || typeof $scope.fund_amount === "undefined") {
                    $scope.message = "The fund amount is invalid";
                    return;
                }
    
                // Fund the project
                $scope.funded = true;
                $scope.fund_amount = "";
                $scope.message = "Thanks for funding this project!"
                Project.addFunder(project._id, $rootScope.user._id, fundAmount).
                success(function(data) {
                        ProjectToFund.funded = data.funded;
                        ProjectToFund.backers = data.backers;
                        $scope.dismissModal();
                        $('#fund-close').click();
                        swal("Thanks", "You've contributed $" + fundAmount, "success");
                    })
                    .error(function(data) {
                        $scope.message = data;
                    });
            };
            
            /**
             * This method is called when the 'I Accept' 
             * check-box is pressed to change the color of the
             * checkmark.
             */
            $scope.accept = function() {
                if ($scope.accepted === "false") {
                    $scope.accepted = "true";
                } else {
                    $scope.accepted = "false";
                }
            }
        
            /**
             * Close the modal.
             */
            $scope.dismissModal = function(result) {
                close(result);
            };

    }]);
    
    /**
     * Filter for the resource link on the project page.
     * It will allow the user to open a new tab.
     */
    app.filter("link", function() {
        return function(link) {
            var result;
            var startingUrl = "http://";
            if (link.startsWith("www")) {
                result = startingUrl + link;
            } else {
                result = link;
            }
            return result;
        }
    });


})();
