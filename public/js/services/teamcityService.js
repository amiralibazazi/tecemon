var teamcityService = angular.module('teamcityservice', []);

teamcityService.service('teamcityService', ['$http', '$q', function($http, $q) {
	var teamcityService = this;
	var allBuildTypesUrl = "https://teamcity.dev.crwd.mx/app/rest/buildTypes/?locator=count:10000";

	var config = { 
		headers: {
			"Content-Type":"application/json;charset=utf-8",
			"Accept":"application/json",
			"Authorization":"CHANGEME"
		}
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

	teamcityService.getBuildsFor = function(buildTypeId) {
		return $http.get("https://teamcity.dev.crwd.mx/app/rest/buildTypes/id:"+buildTypeId+"/builds/?locator=branch:(name:master),running:(any)")
					.then(
						function(response) {
							return response.data;
						},
						function(response) {
							console.log("Failed to retrieve last successful build for <" + buildTypeId + ">");
							$q.reject();
						}
					);
	}
}]);
