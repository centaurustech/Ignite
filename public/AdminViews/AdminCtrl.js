/**
 * Controllers for the admin pages
 */
(function() {
    var app = angular.module('AdminControllers', [
        "UserService",
        "ProjectService",
        "angularModalService"
    ]);
    
    app.controller("ApproveCtrl", ["$scope", "$rootScope" ,"Project", "User", "$routeParams", "ModalService",
        function($scope, $rootScope, Project, User, $routeParams, ModalService) {
            
           $scope.$on('$viewContentLoaded', function(){
             $.fn.fullpage.moveSectionDown();
           });
          
          
          
           $scope.projects;
           $scope.verified = false;
           $scope.tryPassword = function() {
              
              Project.getNonApproved($scope.password)
              .success(function(data) {
                 $scope.verified = true;
                 
                 $scope.projects = data;
                 
                 $scope.projects.forEach(function(project) {
                    var days_left = (new Date(project.end_date).getTime() - new Date().getTime()) / 1000 / 60 / 60 / 24;
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
           }  
           
           $scope.approveProject = function(index) {

                swal({ title: "Approve",
				   text: "When will funding start?",
                   type: "input",
				   inputType: "date",   
				   showCancelButton: true,   
				   closeOnConfirm: false,   
				   animation: "slide-from-top"
                   }, 
				   function(start_date) {   
                      if(start_date === false) {
                          return false;
                      }
                      if(start_date === "") {
                          alert("C'mon, insert a date.");
                      } else {
		                  Project.approveProject($scope.projects[index]._id, start_date)
                          .success(function(data) {

    					   swal("You have approved the project!"); 
                           if (index > -1) {
                                $scope.projects.splice(index, 1);
                            }
                        })
                    }
				   })
                
           };
           
           
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
                    modal.element.modal({
                        //backdrop: 'static'
                    });
                    modal.close.then(function(result) {
    
                    });
                });
            };  
            
        }
    ]);
    
    
    app.controller("UsersViewCtrl", ["$scope", "Project", "User", "$routeParams",
        function($scope, Project, User, $routeParams) {
           $scope.$on('$viewContentLoaded', function(){
             $.fn.fullpage.moveSectionDown();
           });
        
        
        $scope.verified = false;
        $scope.users;
        $scope.tryPassword = function() {
          
          User.getAllUsers($scope.password)
          .success(function(data) {
             $scope.verified = true;
             $scope.users = data;
          }); 
       }
       
        $scope.makeBudgetOwner = function(index) {
            User.makeBudgetOwner($scope.users[index]._id)
            .success(function(user) {
                 $scope.users[index].is_budget_owner = user.is_budget_owner;
                 
            });
        }  
       
    }  
    ]); 
 
})();