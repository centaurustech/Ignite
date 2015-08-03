(function() {
    var app = angular.module('CreateProjectControllers', [
        "UserService",
        "ProjectService"
    ]);

    app.controller("CreateProjectCtrl", ["$scope", "$rootScope", "$window", "Project", "ModalService", "close", function($scope, $rootScope, $window, Project, ModalService, close) {
        $scope.message; // message to show the project is pending approval.
        $scope.form = {}; // initialize a blank project
        $scope.form.resources = []; // initialize resources
        $scope.form.category = {};

        // Resource Form Fields
        $scope.resource_form_role;
        $scope.resource_form_description;

        // Retrieve the categories to select from
        $scope.categories;
        Project.getCategories().success(function(categories) {
            $scope.categories = categories;
        });

        // Retrieve the cities to select from
        $scope.cities;
        Project.getCities().success(function(cities) {
            $scope.cities = cities;
        });


        $scope.submitProject = function() {
            if ($scope.createProjectForm.$valid && $scope.form.category !== undefined) {
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
                        if (input) {
                            $scope.createProject();
                            swal("", "Your Project Will Be Reviewed Soon!", "success");
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

        $scope.createProject = function() {
            var project_image = $scope.project_image;

            // Ensure that the last resource has been added
            if ($scope.resource_form_role !== "" && $scope.resource_form_description !== "") {
                $scope.addResource();
            }

            // Attach the project in the form and project_image to the POST request.
            Project.post($scope.form, project_image)
                .success(function(data) {
                    $scope.message = "Thank you, your project is now pending approval";
                    $scope.dismissModal();
                    $.fn.fullpage.moveSectionDown();
                    $window.location.href = "/#/";
                });
        };

        $scope.resource_form_role = "";
        $scope.resource_form_description = "";

        $scope.addResource = function() {
            if ($scope.resource_form_role === "" || $scope.resource_form_description === "") {
                swal("Please fill out the resource name or link");
                return;
            }

            $scope.form.resources.push({
                role: $scope.resource_form_role,
                description: $scope.resource_form_description
            });
            $scope.resource_form_role = "";
            $scope.resource_form_description = "";

        };

        $scope.categoryColor = "#aacf37";

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
                    $scope.categoryColor = "#aacf37";
                    break;
            }
        }

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
                modal.close.then(function(result) {});
            });
        };

        $scope.dismissModal = function(result) {
            close(result);
        };


        $scope.toolTipText = "";
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

    }]);

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

    String.prototype.startWith = function(str) {
        return this.indexOf(str) == 0;
    };

})();
