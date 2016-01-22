var module = angular.module('tecemonController', ['teamcityservice']);

module.controller('mainController', ['$scope', 'teamcityService', function($scope, teamcityService) {
	$scope.allProjects = [];
	$scope.filteredProjects = [];
	$scope.allBuilds = [];
	$scope.allBuildTypes = [];
	$scope.allLastCompletedBuilds = [];
	$scope.filteredLastCompletedBuilds = [];
	$scope.projectFilter = "";
	$scope.buildTypeFilter = "";

	$scope.successfulBuilds = [];
	$scope.failedBuilds = [];
	$scope.pendingBuilds = [];

	$scope.allProjects = teamcityService.getAllProjects()
		.then(function(projects) {$scope.allProjects = projects; $scope.filteredProjects = projects;});

	$scope.allBuilds = teamcityService.getAllBuilds()
		.then(function(builds) {$scope.allBuilds = builds;});

	var getLastCompletedBuilds = function() {
		angular.forEach($scope.allBuildTypes, function(buildType) {
			teamcityService.getBuildsFor(buildType.id)
			.then(function(builds) {
				if (builds.count != 0) {
					if(builds.build[0].status == 'SUCCESS') {
						buildType.status = 'SUCCESS'
						$scope.successfulBuilds.push(buildType);
					}
					if(builds.build[0].status == 'FAILURE') {
						buildType.status = 'FAILURE'
						$scope.failedBuilds.push(buildType);
					}
				} else {
					buildType.status = 'PENDING'
					console.log("STATUS OF PENDING BUILD: " + JSON.stringify(buildType))
					$scope.pendingBuilds.push(buildType);
				}
			});
		});
	};

	$scope.allBuildTypes = teamcityService.getAllBuildTypes()
		.then(function(buildTypes) {$scope.allBuildTypes = buildTypes; $scope.filteredLastCompletedBuilds = buildTypes})
		.then(getLastCompletedBuilds);

	$scope.filterProjectsBy = function(filterTerm) {
		var regex = new RegExp(filterTerm,"ig");
		$scope.filteredProjects = $scope.allProjects.filter(function(project){
	    	return regex.test(JSON.stringify(project));
		});
	}

	$scope.filterBuildTypesBy = function(filterTerm) {
		var regex = new RegExp(filterTerm,"ig");
		$scope.filteredLastCompletedBuilds = $scope.allBuildTypes.filter(function(buildType) {
			return regex.test(JSON.stringify(buildType));
		});
	}
}]);