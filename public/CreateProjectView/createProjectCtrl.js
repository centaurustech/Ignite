/**
 * Angularjs module that contains all of the controllers related to creating projects.
 * 
 * CreateProjectView is the modal that is shown when the user creates a new project.
 * Users can open this modal from any page that has access to the nav bar. Once the project
 * has been created, it is not yet approved and can be found in the administrator's approveView.
 */
(function() {
    var app = angular.module('CreateProjectControllers', [
        "UserService",
        "ProjectService"
    ]);
    
    /**
     * ===========================================
     * createProjectView.html controller.
     * ===========================================
     */
    app.controller("CreateProjectCtrl", ["$scope", "$rootScope", "$window", "Project", "ModalService", "close", 
        function($scope, $rootScope, $window, Project, ModalService, close) {
           
 
            $scope.form = {};                        // JS Object, A blank project.
            $scope.form.resources = [];              // array, Collection of resources (links) 
            $scope.form.category = {};               // JS Object, Category to be selected
            $scope.project_image;                    // File, the image which is being uploaded
            // Resource Form Fields
            $scope.resource_form_role = "";          // string, The Name
            $scope.resource_form_description = "";   // string, The Link
        
            $scope.categoryColor = "#AACF37";        // Colour to show on the modal's category
            $scope.categories;                       // array, categories for the select combobox
            
            $scope.toolTipText = "";                 // Text shown in the tooltip box when the user focuses on an input.    
            
            
            // Retrieve the categories
            Project.getCategories().success(function(categories) {
                $scope.categories = categories;
            }); 

            /**
             * WRAPPER METHOD for $scope.createProject to confirm or reject
             * the project proposal.
             * 
             * Verifies that the form is filled out correctly.
             */
            $scope.submitProject = function() {
                if ($scope.createProjectForm.$valid && $scope.form.category.name !== undefined) {
                    swal({
                            title: "Are you sure?",
                            text: "",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#AACF37",
                            confirmButtonText: "Yes, submit it!",
                            closeOnConfirm: false
                        },
                        function(input) {
                            // input is a boolean for the decision.
                            if (input) {
                                $scope.createProject();
                                swal("", "Your Project Will Be Reviewed Soon!", "success");
                                // Must call click() in order to close the modal.
                                $('#submit-project').click();
                            } else {
                                return;
                            }
                        });
                } else {
                    swal("The Project Is Not Yet Complete!");
                    $(".ng-invalid-required").css("border", "1px solid red");
                    $(".ng-valid-required").css("border", "none");
                    $(".form-container").css("border", "none");
                }
    
            }
            
            /**
             * Project creation method that send the form request
             * for the project submission to the server.
             * 
             * Once successfully submitted, it will close the modal and redirect to the home page.
             */
            $scope.createProject = function() {
                var project_image = $scope.project_image;
    
                // Ensure that the last resource has been added
                if ($scope.resource_form_role !== "" && $scope.resource_form_description !== "") {
                    $scope.addResource();
                }
                
                if(typeof $scope.form.category.name === 'undefined' || !$scope.form.category.name || $scope.form.category.name === "") {
                    // TODO: Small bug in UI, sometimes the category is not set.
                    $scope.form.category.name = "Technology"; // default to technology
                }
                
                // Attach the project in the form and project_image to the POST request.
                Project.createProject($scope.form, project_image)
                    .success(function(data) {
                        $scope.dismissModal();
                        $.fn.fullpage.moveSectionDown();
                        $window.location.href = "/#/";
                    });
            };
    
            /**
             * Push the entered resource into the $scope.form.resources.
             * Resource fields that are pushed:
             *      $scope.resource_form_role         - name, bound to the input box
             *      $scope.resource_form_description  - link, bound to the input box
             */
            $scope.addResource = function() {
                if ($scope.resource_form_role === "" || $scope.resource_form_description === "") {
                    swal("Please fill out the resource name or link");
                    return;
                }
    
                $scope.form.resources.push({
                    role: $scope.resource_form_role,
                    description: $scope.resource_form_description
                });
                // Reset the input boxes for the next input.
                $scope.resource_form_role = "";
                $scope.resource_form_description = "";
    
            };
    
            /**
             * Set the category colour for the top left of the modal.
             */
            $scope.selectedCategory = function() {
                var name_lower = String($scope.form.category.name).toLowerCase();
    
                switch (name_lower) {
                    case "technology":
                        $scope.categoryColor = "#A796B8";
                        break;
                    case "business":
                        $scope.categoryColor = "#69A9BC";
                        break;
                    case "operations":
                        $scope.categoryColor = "#C5AA8B";
                        break;
                    case "security":
                        $scope.categoryColor = "#8ABD9B";
                        break;
                    default:
                        $scope.categoryColor = "#AACF37";
                        break;
                }
            };
        
            /**
             * Show a preview of the project submission.
             */
            $scope.openSubModal = function() {
                ModalService.showModal({
                    templateUrl: 'ProjectView/projectView.html',
                    controller: 'ProjectController',
                    inputs: {
                        FilteredProjects: [$scope.form],
                        Index: 0,
                        IsPreview: true,
                        Image: $scope.project_image
                    }
                }).then(function(modal) {
                    modal.element.modal({});
                    $('.project-modal').css("z-index", 1080);
                    $('.create-project').css("z-index", 1060);
                    $('.modal-backdrop').css("z-index", 1060);
                    modal.close.then(function(result) {
                        $('.project-modal').css("z-index", 1050);
                        $('.create-project').css("z-index", 1075);
                        $('.modal-backdrop').css("z-index", 1049);
                    });
                });
            };
        
            /**
             * Close the modal.
             */
            $scope.dismissModal = function(result) {
                close(result);
            };
    
    
            /**
             * Change the tooltip message when the user focuses on a different input box.
             * Parameter: inputName
             *  - the name of the input box that is focused.
             */
            $scope.setToolTip = function(inputName) {
                switch (inputName) {
                    case "summary":
                        $scope.toolTipText =
                            "One or two sentences on what your project is all about";
                        break;
                    case "title":
                        $scope.toolTipText =
                            "Title.";
                        break;
                    case "details":
                        $scope.toolTipText =
                            "Additional details not mentioned in the summary";
                        break;
                    case "startDate":
                        $scope.toolTipText =
                            "When would you like to start the campaign?";
                        break;
                    case "fundGoal":
                        $scope.toolTipText =
                            "How much will your project require in funds?";
                        break;
                    case "valueProposition":
                        $scope.toolTipText =
                            "How will this project bring value to HSBC?";
                        break;
                    case "resourceRole":
                        $scope.toolTipText =
                            "Name of this resource";
                        break;
                    case "resourceDescription":
                        $scope.toolTipText =
                            "Link to this resource";
                        break;
                    default:
                        $scope.toolTipText = "";
                }
            }

    }]); // CreateProjectCtrl END.

    // App directive in order to parse the file uploaded.
    app.directive('fileModel', ['$parse', function($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function() {
                    scope.$apply(function() {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);
    
    // String method added onto the prototype to determine if the 
    // string starts with str.
    // Used for checking the resource's link.
    String.prototype.startWith = function(str) {
        return this.indexOf(str) == 0;
    };

})();
