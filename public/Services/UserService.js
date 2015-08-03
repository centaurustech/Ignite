/// <reference path="../../typings/angularjs/angular.d.ts"/>
/**
 * Angular factory used for all CRUD operations for the MoProjectdel model.
 * This module can be included into any other module as a dependency, 
 * the factory associated with this module is used for the CRUD operations.
 */
angular.module('UserService', []).factory('User', ['$http', function($http) {

    return {

        // get all users
        getAllUsers: function(p) {
            return $http.get('/api/user/getAll?p=' + p);
        },

        // set the user by user_id to be a budget owner if they are not already.
        makeBudgetOwner: function(user_id) {
            return $http.post('/api/user/makeBudgetOwner?id=' + user_id);
        },

        // Get a user's information by id
        getUser: function(id) {
            return $http.get('/api/user?id=' + id);
        },

        getDummyUser: function() {
            return $http.get('/api/user/currentDummyUser');
        },

        // Get the current logged in user
        getCurrentUser: function(employeeInfo) {
            return $http({
                method: 'POST',
                url: '/api/user/currentUser',
                data: employeeInfo
            });
        },

        // Retrieve the user's HSBC Employee Information.
        // Return null if the ID is not defined (not accessed from within HSBC)
        getEmployeeInfo: function() {
            var user = {};

            if (staffDetails_name.split(" ").length == 2) {
                user.family_name = staffDetails_name.properCase().split(" ")[1];
                user.given_name = staffDetails_name.properCase().split(" ")[0];
            } else {
                user.family_name = "";
                user.given_name = "";
            }

            user.empId = staffDetails_empid; // employee UID 
            user.phone = staffDetails_extphone; // full phone number 
            user.country = staffDetails_country.toUpperCase(); // country
            user.job_role = staffDetails_jobrole; // Title
            user.dept = staffDetails_dept;
            user.picture = "http://" + staffDetails_photourl;
            user.email = staffDetails_extemail;
            return user;
        },

        // Login with credentials
        login: function(username, password) {
            return $http.post('/api/user/login', {
                'username': username,
                'password': password
            });
        },

        register: function(registerForm) {
            return $http.post('/api/user/register', {
                'username': registerForm.username,
                'password': registerForm.password,
                'first_name': registerForm.first_name,
                'last_name': registerForm.last_name,
                'title': registerForm.title,
                'department': registerForm.department,
                'location': registerForm.location,
                'email': registerForm.email,
                'is_budget_owner': registerForm.is_budget_owner,
                'is_approver': registerForm.is_approver
            });
        },

        getFollowedProjects: function(user_id) {
            return $http.get('/api/user/followedProjects/' + user_id);
        },

        getProjects: function(user_id) {
            return $http.get('/api/user/projects/' + user_id);
        },

        getPendingProjects: function(user_id) {
            return $http.get('/api/user/pendingProjects/' + user_id);
        },

        getFundedProjects: function(user_id) {
            return $http.get('/api/user/fundedProjects/' + user_id);
        },

        // Logout the current user.
        logout: function() {
            return $http.post('/api/user/logout');
        }

    };
}]);
