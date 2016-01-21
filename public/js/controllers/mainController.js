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
		for(var i = 0; i < $scope.allBuildTypes.length; i++) {
			var build = teamcityService.getLastCompletedBuildFor($scope.allBuildTypes[i].id)
			.then(function(build) {
				if (build.status == "SUCCESS") {
					console.log("SUCCESSFUL BUILD: " + JSON.stringify(build));
					$scope.successfulBuilds.push(build);
				} else {
					if (build.status == "FAILURE") {
						console.log("FAILED BUILD: " + JSON.stringify(build));
						$scope.failedBuilds.push(build);
					} else {
						console.log("PENDING BUILD: " + JSON.stringify(build));
						$scope.pendingBuilds.push(build);
					};
				};
			});
		};
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