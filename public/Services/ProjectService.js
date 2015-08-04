/**
 * Angular factory used for all api methods on Projects /api/project.
 */
angular.module('ProjectService', []).factory('Project', ['$http', '$rootScope', function($http, $rootScope) {

    return {
        /**
         * Retrieve all projects that are approved
         * Return
         *      Array of JS Object Projects
         */
        getApprovedProjects: function() {
            return $http.get('/api/project');
        },
        
        /**
         * Retrieve all projects that are NOT approved
         * Parameter
         *      p -  String: the password.
         * Return
         *      Array of JS Object Projects
         */
        getNonApproved: function(p) {
            return $http.get('/api/project/nonApproved?p=' + p);
        },
        
        /**
         * Approve a project to start being funded.
         * Parameters 
         *      project_id - String: the _id of the project to be approved
         *      start_date - JS Date: the date that the project can start being funded.  
         */
        approveProject: function(project_id, start_date) {
            console.log('/api/project/approveProject?id=' + project_id + "&start_date=" + start_date);
            return $http.post('/api/project/approveProject?id=' + project_id + "&start_date=" + start_date);
        },
        
        /**
         * Post request to send in a project submission.
         * Parameters
         *      Project: JS Object with all of the project fields filled out. (see Project schema)
         *      Image: JS File of an image.
         * Return
         *      the _id of the newly created project.
         */
        createProject: function(project, image) {

            var formData = new FormData();
            formData.append('user', angular.toJson($rootScope.user));
            formData.append('file', image);
            formData.append('project', angular.toJson(project));

            return $http.post('/api/project', formData, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                } // required, in order to set to multipart
            });
        },
        
        /**
         * Retrieve a project by it's id.
         * Return
         *      JS Object for Project
         */
        getById: function(id) {
            return $http.get('/api/project/' + id);
        },
        
        /**
         * Add funder to the project.
         * Parameters
         *      projectId  - String: the _id of the project to be funded
         *      userId     - String: the _id of the user who is funding
         *      fundAmount - Number: the amount to fund.
         * Return
         *      JS Object for updated Project
         */
        addFunder: function(projectId, userId, fundAmount) {
            return $http.post('/api/project/' + projectId +
                '/add_backer?backer_id=' + userId +
                '&funded=' + fundAmount);
        },
        
        /**
         * Add an Endorser to the project
         * Parameters
         *      projectId  - String: the _id of the project to be endorsed
         *      userId     - String: the _id of the user who is endorsing
         * Return
         *      JS Object for updated Project
         */
        addEndorser: function(projectId, userId) {
            return $http.post('/api/project/' + projectId +
                '/add_follower?user_id=' + userId);
        },
        
        /**
         * Add comment to the project.
         * Parameters
         *      projectId  - String: the _id of the project to be commented on
         *      userId     - String: the _id of the user who is commenting
         *      comment    - String: the comment
         * Return
         *      JS Object for Project
         */
        addComment: function(projectId, userId, comment) {
            return $http.post('/api/project/' + projectId +
                '/add_comment?user_id=' + userId +
                '&comment=' + comment);
        },

        /**
         * Retrieve all categories in the database at the server.
         * Return
         *      Array of Category Objects.
         *          - name, projects in each category, _id
         */
        getCategories: function() {
            return $http.get('/api/project/categories');
        }
    };

}]);
