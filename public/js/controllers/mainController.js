var module = angular.module('tecemonController', ['teamcityservice']);

module.controller('mainController', ['$scope', 'teamcityService', function($scope, teamcityService) {
	$scope.allProjects = [];
	$scope.filteredProjects = [];
	$scope.allBuilds = [];
	$scope.allBuildTypes = [];
	$scope.allLastCompletedBuilds = [];
	$scope.filteredBuildTypes = [];
	$scope.projectFilter = "";
	$scope.buildTypeFilter = "";

	$scope.allProjects = teamcityService.getAllProjects()
		.then(function(projects) {$scope.allProjects = projects; $scope.filteredProjects = projects;});

	$scope.allBuilds = teamcityService.getAllBuilds()
		.then(function(builds) {$scope.allBuilds = builds;});


	var getLastCompletedBuilds = function() {
		for(var i = 0; i < $scope.allBuildTypes.length; i++) {
			var build = teamcityService.getLastCompletedBuildFor($scope.allBuildTypes[i].id)
			.then(function(build) {
				console.log("LAST COMPLETED BUILD FOR BUILD TYPE : " + JSON.stringify(build));
				$scope.allLastCompletedBuilds.push(build);
			});
		};

	};

	$scope.allBuildTypes = teamcityService.getAllBuildTypes()
		.then(function(buildTypes) {$scope.allBuildTypes = buildTypes; $scope.filteredBuildTypes = buildTypes})
		.then(getLastCompletedBuilds);

	$scope.filterProjectsBy = function(filterTerm) {
		var regex = new RegExp(filterTerm,"ig");
		$scope.filteredProjects = $scope.allProjects.filter(function(project){
	    	return regex.test(JSON.stringify(project));
		});
	}

	$scope.filterBuildTypesBy = function(filterTerm) {
		var regex = new RegExp(filterTerm,"ig");
		$scope.filteredBuildTypes = $scope.	allBuildTypes.filter(function(buildType) {
			return regex.test(JSON.stringify(buildType));
		});
	}
}]);