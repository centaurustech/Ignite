/**
 * Angular Module and Controller for mainView.html
 */
(function() {
    var app = angular.module('Ignite', [
        "ngRoute",
        "UserService",
        "HomeControllers",
        "ProjectControllers",
        "ProfileControllers",
        "AdminControllers",
        "ProjectFilters",
        "ngAnimate",
        "angularModalService"
    ]);


    app.config(["$routeProvider",
        function($routeProvider) {
            $routeProvider
                .when('/homeView', {
                    templateUrl: 'HomeView/homeView.html',
                    controller: 'HomeController'
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
                    redirectTo: '/homeView'
                });
        }
    ]);

    app.run(function($rootScope) {
        angular.element(document.querySelector('#fullpage'))
            .fullpage({
                paddingTop: '105px',
                paddingBottom: '10px',
                normalScrollElements: '#project-gallery, .modal, #profileView, .navbar, #fullpage, .footer',
            });

        $rootScope.$on('$viewContentLoaded', function() {

        });

        $('.modal').on('hidden.bs.modal', function(event) {
            $(this).removeClass('fv-modal-stack');
            $('body').data('fv_open_modals', $('body').data('fv_open_modals') - 1);
        });


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

        $rootScope.showNotImplemented = function() {
            swal("Sorry This Feature Is Not Yet Complete. Please Try Again Later :)");
        }

    });

    app.controller("IndexController", ["$scope", "$rootScope", "User", "$window", "ModalService", function($scope, $rootScope, User, $window, ModalService) {
        $rootScope.user = null;
        
        // staffDetails_name = "alex tang";
        // staffDetails_empid = "e";  // change this for new simulate HSBC user.	 
        // staffDetails_extphone = "1234"; 
        // staffDetails_country = "CA";
        // staffDetails_jobrole = "SDE";
        // staffDetails_dept = "CDM";							
        // staffDetails_photourl = "api.adorable.io/avatars/100/" + Math.floor(String(Math.random() * 100));
        // staffDetails_extemail = "tang.alex.93@gmail.com";
            
            
        User.getDummyUser().success(function(data) {
           if(data) {
               // get dummy user first if we've logged in with local authentication.
               $rootScope.user = data;
           } else if(typeof staffDetails_empid === 'undefined') {
               // if it does not exist, then we check if we have hsbc auth.
               // redirect to login if not.
                $window.location.href="/login.html";
           } else {
               var employeeInfo = User.getEmployeeInfo();
               if(employeeInfo) {
                   User.getCurrentUser(employeeInfo).success(function(data) {
                       $rootScope.user = data; 
                   });
                }
           }
        });           

        // logout function for the logout button
        $scope.logout = function() {
            User.logout().success(function(data) {
                $window.location.href = "/login.html";
            });
        };

        // Scrolling for two main sections
        $scope.screen = "down";
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


        // Navbar - Create Project
        $scope.openCreateProjectModal = function() {
            ModalService.showModal({
                templateUrl: 'ProjectView/createProjectView.html',
                controller: 'CreateProjectCtrl'
            }).then(function(modal) {
                modal.element.modal({
                    //backdrop: 'static'
                });
                modal.close.then(function(result) {

                });
            });
        };

        // Navigate to Gallery
        $scope.explore = function() {
            $scope.scrollDown();
            $window.location.href = "/#/homeView";
        }
        
        $scope.moveToSearchScreen = function() {
            $scope.scrollDown();
            $window.location.href = "/#/homeView";
        }
    }]);
    
    String.prototype.properCase = function (str) {
		return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	};

})();
