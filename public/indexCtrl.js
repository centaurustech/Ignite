/**
 * Angular Module and Controller for mainView.html
 * 
 * This is the APPLICATION ROOT MODULE.
 * It has dependencies on each other sub module. 
 */
(function() {
    var app = angular.module('Ignite', [
        "ngRoute",
        "UserService",
        "IndexControllers",
        "ProjectControllers",
        "CreateProjectControllers",
        "GalleryControllers",
        "ProfileControllers",
        "AdminControllers",
        "angularModalService"
    ]);

    // Set up the routes for the ng-view
    app.config(["$routeProvider",
        function($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'GalleryView/ProjectGallery.html',
                    controller: 'ProjectGalleryCtrl'
                })
                .when('/profileView/:userId', {
                    templateUrl: 'ProfileView/profileView.html',
                    controller: 'ProfileController'
                })
                .when('/projectView/:projectId', {
                    templateUrl: 'ProjectView/projectView.html',
                    controller: 'ProjectController'
                })
                .when('/createProject/', {
                    templateUrl: 'ProjectView/createProjectView.html',
                    controller: 'CreateProjectCtrl'
                })
                .when('/usersView', {
                    templateUrl: 'AdminViews/usersView.html',
                    controller: 'UsersViewCtrl'
                })
                .when('/approveView', {
                    templateUrl: 'AdminViews/approveView.html',
                    controller: 'ApproveCtrl'
                })
                .otherwise({
                    redirectTo: '/'
                });
        }
    ]);
    
    app.run(function($rootScope) {
        // Initialization code for FullPageJS. 
        angular.element(document.querySelector('#fullpage'))
            .fullpage({
                paddingTop: '105px',
                paddingBottom: '10px',
                normalScrollElements: '#project-gallery, .modal, #profileView, .navbar, #fullpage, .footer',
            });

        $rootScope.$on('$viewContentLoaded', function() {

        });
        
        /**
         * Show a popup that says the feature is not yet implemented.
         */
        $rootScope.showNotImplemented = function() {
            swal("Sorry This Feature Is Not Yet Complete. Please Try Again Later :)");
        }
        // Allow showing of multiple modals
        $('.modal').on('hidden.bs.modal', function(event) {
            $(this).removeClass('fv-modal-stack');
            $('body').data('fv_open_modals', $('body').data('fv_open_modals') - 1);
        });
        
        // Allow showing of multiple modals 
        $('.modal').on('shown.bs.modal', function(event) {
            // keep track of the number of open modals
            if (typeof($('body').data('fv_open_modals')) == 'undefined') {
                $('body').data('fv_open_modals', 0);
            }
            // if the z-index of this modal has been set, ignore.
            if ($(this).hasClass('fv-modal-stack')) {
                return;
            }
            $(this).addClass('fv-modal-stack');
            $('body').data('fv_open_modals', $('body').data('fv_open_modals') + 1);
            $(this).css('z-index', 1040 + (10 * $('body').data('fv_open_modals')));
            $('.modal-backdrop').not('.fv-modal-stack')
                .css('z-index', 1039 + (10 * $('body').data('fv_open_modals')));
            $('.modal-backdrop').not('fv-modal-stack')
                .addClass('fv-modal-stack');
        });



    });

    app.controller("IndexController", ["$scope", "$rootScope", "User", "$window", "ModalService", function($scope, $rootScope, User, $window, ModalService) {
        $rootScope.user = null;
        
        $scope.screen = "down";             // String, either up or down. If Up we are on the lower screen, upperscreen otherwise.
           
        // staffDetails_name = "alex tang";
        // staffDetails_empid = "e";  // change this for new simulate HSBC user.     
        // staffDetails_extphone = "1234"; 
        // staffDetails_country = "CA";
        // staffDetails_jobrole = "SDE";
        // staffDetails_dept = "CDM";                           
        // staffDetails_photourl = "api.adorable.io/avatars/100/" + Math.floor(String(Math.random() * 100));
        // staffDetails_extemail = "tang.alex.93@gmail.com";

        /**
         * Check if the user logged in is from the HSBC Intranet.
         * A dummy user is any user who is not from the HSBC Intranet that was registered.
         * 
         * If the user is using a dummy account, add the user to the root scope.
         * If the user is not using a dummy account (nothing returned), check if they are signed in with SSO.
         * If the user is not signed in, redirect them to the registration page for a dummy account.
         * If the user is signed in, get all known information about them, if there is none, add a new entry for them.
         */
        User.getDummyUser().success(function(data) {
            if (data) {
                // get dummy user first if we've logged in with local authentication.
                $rootScope.user = data;
            } else if (typeof staffDetails_empid === 'undefined') {
                // if it does not exist, then we check if we have hsbc auth.
                // redirect to login if not.
                $window.location.href = "/LoadUser/loadUserView.html";
            } else {
                var employeeInfo = User.getEmployeeInfo();
                if (employeeInfo) {
                    User.getSSOUser(employeeInfo).success(function(data) {
                        $rootScope.user = data;
                    });
                }
            }
        });

        /**
         * Logout function for the logout button.
         * Log out the current user (this only works for registered accounts, not SSO).
         * It is currently not being used.
         */
        $scope.logout = function() {
            User.logout().success(function(data) {
                $window.location.href = "/LoadUser/loadUserView.html";
            });
        };

        // Scrolling for two main sections
        $scope.scroll = function() {
            if ($scope.screen === "down") {
                $scope.screen = "up";
                $.fn.fullpage.moveSectionDown();
            } else {
                $scope.screen = "down";
                $.fn.fullpage.moveSectionUp();
            }
        };

        // Scroll Down 
        $scope.scrollDown = function() {
            $.fn.fullpage.moveSectionDown();
            $scope.screen = "up";
        }
        
        /**
         * Scroll Up
         */
         $scope.scrollUp = function() {
             $.fn.fullpage.moveSectionUp();
             $scope.screen = "down";
         }


        // Navbar - Create Project
        $scope.openCreateProjectModal = function() {
            ModalService.showModal({
                templateUrl: 'CreateProjectView/createProjectView.html',
                controller: 'CreateProjectCtrl'
            }).then(function(modal) {
                modal.element.modal({});
                modal.close.then(function(result) {

                });
            });
        };

        // Navigate to Gallery
        $scope.showGallery = function() {
            $scope.scrollDown();
            $window.location.href = "/#/";
        }
        
        /**
         * Navigate to the banner view.
         */
        $scope.showBanner = function() {
            $scope.scrollUp();
        }
    }]);

    String.prototype.properCase = function(str) {
        return this.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    };

})();
