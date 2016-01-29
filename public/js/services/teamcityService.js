var teamcityService = angular.module('teamcityservice', []);

teamcityService.service('teamcityService', ['$http', '$q', function($http, $q) {
	var teamcityService = this;
	var allBuildTypesUrl = "https://teamcity.dev.crwd.mx/app/rest/buildTypes/?locator=count:10000";

	var config = { 
		headers: {
			"Content-Type":"application/json;charset=utf-8",
			"Accept":"application/json",
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

	teamcityService.constructLastCompletedBuildFor = function(buildType) {
		return $http.get("https://teamcity.dev.crwd.mx/app/rest/buildTypes/id:"+buildType.id+"/builds/?locator=running:(any)")
			.then(
				function(response) {
					if (hasBuilds(response.data))
						buildType = enrichBuildType(buildType, response.data)						
					else buildType.status = 'PENDING'
						
					return buildType;
				},
				function(response) {
					console.log("Failed to retrieve last successful build for <" + buildTypeId + ">");
					$q.reject();
				}
			);

	}

	var hasBuilds = function(builds) {
		return builds.count != 0 
	}

	var enrichBuildType = function(buildType, builds) {
		var lastCompletedBuild = buildType;
		if(builds.build[0].status == 'SUCCESS') lastCompletedBuild.status = 'SUCCESS'
    	if(builds.build[0].status == 'FAILURE') lastCompletedBuild.status = 'FAILURE'
		if (builds.build[0].state == 'running') lastCompletedBuild.percentageComplete = builds.build[0].percentageComplete;
		if (builds.build) lastCompletedBuild.state = builds.build[0].state;	
		return lastCompletedBuild;
	}
}]);
