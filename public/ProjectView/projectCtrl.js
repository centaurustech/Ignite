/**
 * Angular Module and Controller for HomeView Partial
 */
(function() {
	var app = angular.module('ProjectControllers', 
		[
			"UserService",
			"ProjectService"
		]);
	
	app.controller("ProjectController", 
		["$scope", "$rootScope", "$location", "ModalService", "Project", "FilteredProjects", "Index", "IsPreview", "Image", "close", 
		function($scope, $rootScope, $location, ModalService, Project, FilteredProjects, Index, IsPreview, Image, close) {	
		
		// If it is a preview, it must be prepopulated with default values.
		if(IsPreview === true) {
			FilteredProjects[0].category = (FilteredProjects[0].category ? {name: String(FilteredProjects[0].category.name)} : {name :"Technology"} );
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
			FilteredProjects[0].image = URL.createObjectURL(Image);	
		}
		
		$scope.filteredProjects = FilteredProjects;
		$scope.message;
		$scope.currentIndex = Index;
		$scope.slideIndex = Index;
		$scope.fundAmount;
		
		
		$scope.fund = function() {
		    ModalService.showModal({
			    templateUrl: 'ProjectView/FundModal.html',
				controller: 'FundCtrl',
				inputs: { ProjectToFund: $scope.filteredProjects[$scope.currentIndex] }
		    }).then(function(modal) {
			    modal.element.modal({ backdrop: 'static'});
				$('.project-modal').css("z-index", 1050);
				$('.modal-backdrop').css("z-index", 1060);
			    modal.close.then(function(result) {
					$('.project-modal').css("z-index", 1075);
					$('.modal-backdrop').css("z-index", 1049);
			    });
    		});
		};
			// swal({ title: "FundIT",
			// 	   text: "How Much Would You Like To Fund?",
			// 	   type: "input",   
			// 	   showCancelButton: true,   
			// 	   closeOnConfirm: false,   
			// 	   animation: "slide-from-top",   
			// 	   inputPlaceholder: "Fund Amount" }, 
			// 	   function(inputValue) {   
			// 		   if (inputValue === false) return false;      
			// 		   if (isNaN(inputValue) || inputValue == "") {     
			// 			   swal.showInputError("Please Enter a Dollar Value");     
			// 			   return false;  
			// 		   }      
			// 		   $scope.fundProject($scope.filteredProjects[$scope.currentIndex], $scope.currentIndex, inputValue);
			// 		   swal("Really?", "That's all that you've got?  $" + inputValue, "success"); 
			// 	   });

		
		$scope.fundProject = function(project, index, fundAmount) {
			
			Project.addBacker(project._id, $rootScope.user._id, fundAmount).
				success(function(data) {
					$scope.filteredProjects[index].funded = data.funded;
					$scope.filteredProjects[index].backers = data.backers;
				})
				.error(function(data) {
					$scope.message = data;
				});
		};
		
		$scope.addComment = function() {
			swal({ title: "Add a Comment",
			   text: "What would you like to say?",
			   type: "input",   
			   showCancelButton: true,   
			   closeOnConfirm: false,   
			   animation: "slide-from-top",   
			   inputPlaceholder: "Comment" }, 
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
		}
		
		$scope.showSection = {
			showDetails: true,
			showBackers: false,
			showComments: false,
		}
		
		$scope.hideAllSections = function() {
			for (var key in $scope.showSection) {
			  if ($scope.showSection.hasOwnProperty(key)) {
				$scope.showSection[key] = false;
			  }
			}
		}
		
		$scope.showBackers = function(project) {
			$scope.hideAllSections();
			$scope.showSection["showBackers"] = true;
		}
		
		$scope.showDetails = function(project) {
			$scope.hideAllSections();
			$scope.showSection["showDetails"] = true;
		}
		
		$scope.showComments = function(project) {
			$scope.hideAllSections();
			$scope.showSection["showComments"] = true;
		}
		
		$scope.slideLeft = function() {
			$scope.slideIndex === 0 ? $scope.filteredProjects.length - 1 : $scope.slideIndex--;
		}
		$scope.slideRight = function() {
			$scope.slideIndex === $scope.filteredProjects.length - 1 ? 0 : $scope.slideIndex++;
		}

		$scope.closeModalAndRedirect = function(url) {
			$scope.dismissModal();
			$location.url(url);
		}
		
		 $scope.dismissModal = function(result) {
		    close(result); 
		 };
		 
 		$scope.followProject = function(projectId) {
			var currentProject = $scope.filteredProjects[$scope.currentIndex];
			if(currentProject.isFollowed) {
				swal("You've already endorsed this project!");
			} else {
				currentProject.isFollowed = true;
				Project.addFollower(projectId, $rootScope.user._id)
					   .success(function(data) {
						   swal("Thanks for the support!", "You just endorsed this project!", "success");
						   $scope.filteredProjects[$scope.currentIndex].viewStarImage = "/assets/icons/card-icons/Star.svg";
						   $scope.filteredProjects[$scope.currentIndex].followers = data.followers;
					   });
				}	
			}
			 
		
	}]);
	
	app.controller("FundCtrl", ["$scope", "$rootScope", "Project", "ProjectToFund", "close", function($scope, $rootScope, Project, ProjectToFund, close) {
		
		
		$scope.project = ProjectToFund;
		$scope.message;
		$scope.accepted = "false";
		$scope.fundProject = function(project, fundAmount) {
			// Ensure the user has accepted the terms
			if($scope.accepted === "false") {
				$scope.message = "Please accept the terms.";
				return;
			}
			// Ensure the user has entered the correct employee id
			if($scope.employee_id === $rootScope.user.employee_id ) {
				$scope.message ="Your employee id is incorrect.";
				return;
			}
			// Ensure the user has funded a value greater than 0
			if($scope.fund_amount <= 0 || typeof $scope.fund_amount === "undefined") {
				$scope.message = "The fund amount is invalid";
				return;
			}
			
			// Fund the project
			$scope.funded = true;
			$scope.fund_amount = "";
			$scope.message = "Thanks for funding this project!"
			Project.addBacker(project._id, $rootScope.user._id, fundAmount).
				success(function(data) {
					ProjectToFund.funded = data.funded;
					ProjectToFund.backers = data.backers;
				})
				.error(function(data) {
					$scope.message = data;
				});
		};
		
		$scope.accept = function() {
			if($scope.accepted === "false") {
				$scope.accepted = "true";
			} else {
				$scope.accepted = "false";
			}
		}
		
		$scope.dismissModal = function(result) {
		    close(result); 
		 };
		 
	}]);
	
	app.filter("link", function () {
		return function (link) {
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
