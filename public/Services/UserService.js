/**
 * Angular factory used for all API requests /api/users/
 */
angular.module('UserService', []).factory('User', ['$http', function($http) {

    return {

        /**
         * Retrieve all users that are registered.
         * Parameter
         *      p - String: the password.
         * Return
         *      Array of all users
         */
        getAllUsers: function(p) {
            return $http.get('/api/user/getAll?p=' + p);
        },

        /**
         * Set the user to be a budget owner if they are not already.
         * Parameters
         *      user_id - String: the _id of the user to be made into a budget owner.
         */
        makeBudgetOwner: function(user_id) {
            return $http.post('/api/user/makeBudgetOwner?id=' + user_id);
        },

        /**
         * Retrieve a user by id
         * Parameters
         *      id - String: _id of the user
         */
        getUser: function(id) {
            return $http.get('/api/user?id=' + id);
        },

        /**
         * The dummy user is a user that is not created by SSO.
         * This dummy user has a registered session and the information
         * is saved on the server.
         * Return
         *      JS User Object if they are logged in with a dummy account, 
         *      otherwise null.
         */
        getDummyUser: function() {
            return $http.get('/api/user/currentDummyUser');
        },

        /**
         * This method should only be called if the user is logged in with SSO.
         * It will return all information that is known about the logged in user.
         * If there is no known information about the user, it will add a new entry
         * in the database for them.
         * 
         * Parameter
         *      employeeInfo - JS Object: All SSO data. See getEmployeeInfo()
         */
        getSSOUser: function(employeeInfo) {
            return $http({
                method: 'POST',
                url: '/api/user/currentUser',
                data: employeeInfo
            });
        },

        /**
         * Retrieve the user's HSBC Employee Information from the global scope.
         * Return 
         *      null if the ID is not defined (not accessed from within HSBC)
         *      A JS object with all the properties otherwise.
         * 
         */ 
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

        /**
         * Login for the dummy accounts.
         * Parameters
         *      username - String: it pains me to type this.
         *      password - String: this hurts as well.
         * 
         * Return
         *      A string message if unsuccessful, 
         *      HTTP 200 OK, otherwise.
         */
        login: function(username, password) {
            return $http.post('/api/user/login', {
                'username': username,
                'password': password
            });
        },
        
        /**
         * Register a new dummy account.
         * Parameters:
         *      registerForm - JS Object: Required fields can be found below.
         * Return:
         *      4XX and message if the username is already taken,
         *      200 if registered, with no message body.
         */
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

        /**
         * Retrieve all projects that a user has endorsed.
         * Parameter
         *      user_id - String: the _id of the user
         * Return
         *      Array of all projects that have been endorsed by the user.
         */
        getEndorsedProjects: function(user_id) {
            return $http.get('/api/user/followedProjects/' + user_id);
        },

        /**
         * Retrieve all projects created by a user
         * Parameter
         *      user_id - String: the _id of the user
         * Return
         *      Array of all projects that have been created by the user.
         */
        getProjects: function(user_id) {
            return $http.get('/api/user/projects/' + user_id);
        },

        /**
         * Logout the current DUMMY user.
         * It does absolutely nothing for user signed in through SSO.
         * It will end the session on the server associated to this account.
         */
        logout: function() {
            return $http.post('/api/user/logout');
        }

    };
}]);
