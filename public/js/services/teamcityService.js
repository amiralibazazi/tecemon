var teamcityService = angular.module('teamcityservice', []);

teamcityService.service('teamcityService', ['$http', '$q', function($http, $q) {
	var teamcityService = this;
	var allBuildsUrl = "https://teamcity.dev.crwd.mx/app/rest/builds/?locator=count:100000,branch:(default:true),affectedProject:(id:_Root),running:(any),sinceBuild(id:0)";
	var allProjectsUrl = "https://teamcity.dev.crwd.mx/app/rest/projects/?locator=count:100000";
	var allBuildTypesUrl = "https://teamcity.dev.crwd.mx/app/rest/buildTypes/?locator=count:10000";

	var config = { 
		headers: {
			"Content-Type":"application/json;charset=utf-8",
			"Accept":"application/json",
			"Authorization":"CHANGEME""
		}
	}

	teamcityService.getAllProjects = function() {
		return $http.get(allProjectsUrl, config)
					.then(
						function(response) {
							console.log("Successfully received projects from TeamCity");
							return response.data.project;
						},
						function(response) {
							console.log("Failed to retrieve projects from TeamCity");
							$q.reject();
						}
					);
	};

	teamcityService.getAllBuilds = function() {
		return $http.get(allBuildsUrl, config)
					.then(
						function(response) {
							console.log("Successfully received builds from TeamCity");
							return response.data.build;
						},
						function(response) {
							console.log("Failed to retrieve builds from TeamCity");
							$q.reject();
						}
					);
	}

	teamcityService.getAllBuildTypes = function() {
		return $http.get(allBuildTypesUrl, config)
					.then(
						function(response) {
							console.log("Successfully received BuildTypes from TeamCity");
							return response.data.buildType
						},
						function(response) {
							console.log("Failed to receive BuildTypes from TeamcCity");
							$q.reject();
						}
					);
	}

	teamcityService.getLastCompletedBuildFor = function(buildTypeId) {
		return $http.get("https://teamcity.dev.crwd.mx/app/rest/buildTypes/id:"+buildTypeId+"/builds")
					.then(
						function(response) {
							if (typeof response.data.build != 'undefined') {
								console.log("LAST BUILD FOR <" + buildTypeId + "> WAS " + JSON.stringify(response.data.build[0]));
								return response.data.build[0];
							}
						},
						function(response) {
							console.log("Failed to retrieve last successful build for <" + buildTypeId + ">");
							$q.reject();
						}
					);
	}
}]);
