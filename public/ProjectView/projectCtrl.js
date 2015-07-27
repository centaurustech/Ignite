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
		["$scope", "$rootScope", "$location", "Project", "FilteredProjects", "Index", "IsPreview", "close", 
		function($scope, $rootScope, $location, Project, FilteredProjects, Index, IsPreview, close) {	
		
		// If it is a preview, it must be prepopulated with default values.
		if(IsPreview === true) {
			FilteredProjects[0].category = (FilteredProjects[0].category ? {name: String(FilteredProjects[0].category)} : {name: "Technology"});
			FilteredProjects[0].funded = 0;
			FilteredProjects[0].days_left = 0;
			FilteredProjects[0].followers = [];
			FilteredProjects[0].backers = [];
			FilteredProjects[0].image = "/assets/images/default_project_image.jpg";
			FilteredProjects[0].budget = (FilteredProjects[0].budget ? FilteredProjects[0].budget : 0);
			FilteredProjects[0].start_date = (FilteredProjects[0].start_date ? new Date() : 0);
		}
		
		$scope.filteredProjects = FilteredProjects;
		$scope.message;
		$scope.currentIndex = Index;
		$scope.slideIndex = Index;
		$scope.fundAmount;
		
		
		$scope.fund = function() {
			swal({ title: "FUNDIT",
				   text: "How Much Would You Like To Fund?",
				   type: "input",   
				   showCancelButton: true,   
				   closeOnConfirm: false,   
				   animation: "slide-from-top",   
				   inputPlaceholder: "Fund Amount" }, 
				   function(inputValue) {   
					   if (inputValue === false) return false;      
					   if (isNaN(inputValue) || inputValue == "") {     
						   swal.showInputError("Please Enter a Dollar Value");     
						   return false;  
					   }      
					   $scope.fundProject($scope.filteredProjects[$scope.currentIndex], $scope.currentIndex, inputValue);
					   swal("Nice!", "You just funded the project for: $" + inputValue, "success"); 
				   });
		}

		
		$scope.fundProject = function(project, index, fundAmount) {
			
			Project.addBacker(project._id, $rootScope.user._id, fundAmount).
				success(function(data) {
					// Update this project.
					var days_left = (new Date(data.end_date).getTime() - new Date().getTime()) / 1000 / 60 / 60 / 24;
					data.days_left = days_left > 0 ? days_left : 0;
					
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
		
		$scope.slideLeft = function() {
			$scope.slideIndex === 0 ? $scope.filteredProjects.length - 1 : $scope.slideIndex--;
		}
		$scope.slideRight = function() {
			$scope.slideIndex === $scope.filteredProjects.length - 1 ? 0 : $scope.slideIndex++;
		}

		$scope.closeModalAndRedirect = function() {
			var url = "/profileView/" + $scope.filteredProjects[$scope.currentIndex].creator._id;
			$scope.dismissModal();
			$location.url(url);
		}
		
		 $scope.dismissModal = function(result) {
		    close(result); 
		 };
		 
 		$scope.followProject = function(projectId) {
			Project.addFollower(projectId, $rootScope.user._id)
				   .success(function(data) {
					   swal("Thanks for the support!", "You just endorsed this project!", "success");
					   $scope.filteredProjects[$scope.currentIndex].followers = data.followers;
				   });
		}
		
	}]);
	
	app.controller("CreateProjectCtrl", ["$scope", "$rootScope", "Project", "ModalService", "close", function($scope, $rootScope, Project, ModalService, close) {
		$scope.message;					// message to show the project is pending approval.
		$scope.form = {}; 				// initialize a blank project
		$scope.form.resources = [];		// initialize resources
		
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
			if($scope.createProjectForm.$valid && $scope.form.category !== undefined) {
				$scope.createProject();
				$('#submit-project').click();	
			} else {
				swal("The Project Is Not Yet Complete!");
			}
			
		}
		
		$scope.createProject = function() {
			var project_image = $scope.project_image;
			
			// Ensure that the last resource has been added
			if($scope.resource_form_role !== "" && $scope.resource_form_description !== "") {
				$scope.addResource();
			}

			// Attach the project in the form and project_image to the POST request.
			Project.post($scope.form, project_image)
				.success(function(data) {
					$scope.message = "Thank you, your project is now pending approval";
				});
		};
		
		$scope.resource_form_role = "";
		$scope.resource_form_description = "";
		
		$scope.addResource = function() {
			if($scope.resource_form_role === "" || $scope.resource_form_description === "") {
				swal("Please fill out the resource name or link");
				return;
			}
			
			$scope.form.resources.push({ role: $scope.resource_form_role, 
										 description: $scope.resource_form_description });
			$scope.resource_form_role = "";
			$scope.resource_form_description = "";
													 
		};
		
		$scope.categoryColor = "#aacf37";
		
		$scope.selectedCategory = function() {
			var name_lower = String($scope.form.category).toLowerCase();
			switch(name_lower) {
				case "technology":  $scope.categoryColor =  "#b1b1a6"; break;
				case "business":    $scope.categoryColor = "#53a6be"; break;
				case "operations":  $scope.categoryColor = "#acadbf"; break;
				case "security":    $scope.categoryColor = "#c59079"; break;
				default: 		    $scope.categoryColor = "#aacf37"; break;
			}	
			console.log($scope.categoryColor);
		}
		
		$scope.openSubModal = function() {
		    ModalService.showModal({
			    templateUrl: 'ProjectView/projectView.html',
				controller: 'ProjectController',
				inputs: { FilteredProjects: [$scope.form], Index: 0, IsPreview: true }
		    }).then(function(modal) {
			    modal.element.modal({});
			    modal.close.then(function(result) {
			   	    
			    });
    		});
		};
		
		$scope.dismissModal = function(result) {
		    close(result); 
		 };
		 
		 
		 $scope.toolTipText = "";
		 $scope.setToolTip = function(inputName) {
			 switch(inputName) {
				 case "summary": $scope.toolTipText = 	
				  	"Just a brief summary on what your project is";
					break;
				 case "title": $scope.toolTipText = 
				 	"Title.";
					 break;
				 case "details": $scope.toolTipText = 
				 	"Additional details not mentioned in the summary";
					break;
				 case "startDate": $scope.toolTipText = 
				 	"When would you like to start the campaign?";
					break;
				 case "fundGoal": $scope.toolTipText = 
				 	"How much will your project require in funds?";
				 	break;
				 case "valueProposition": $scope.toolTipText = 
				 	"How will this project bring value to HSBC?";
					 break;
				 case "resourceRole": $scope.toolTipText = 
				 	"Name of this resource"; 
					break;
				 case "resourceDescription": $scope.toolTipText = 
				 	"Link to this resource";
					 break;
				 default: $scope.toolTipText = "";
			 }
		 }
		 
	}]);
	
	// App directive in order to parse the file uploaded.
	app.directive('fileModel', ['$parse', function ($parse) {
	    return {
	        restrict: 'A',
	        link: function(scope, element, attrs) {
	            var model = $parse(attrs.fileModel);
	            var modelSetter = model.assign;
	            
	            element.bind('change', function(){
	                scope.$apply(function(){
	                    modelSetter(scope, element[0].files[0]);
	                });
	            });
	        }
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
	
	String.prototype.startWith = function (str) {
		return this.indexOf(str) == 0;
	};
	
})();
