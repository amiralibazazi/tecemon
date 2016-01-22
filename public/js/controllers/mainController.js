var module = angular.module('tecemonController', ['teamcityservice', 'filters']);

module.controller('mainController', ['$scope', 'teamcityService', function($scope, teamcityService) {
	$scope.allProjects = [];
	$scope.filteredProjects = [];
	$scope.allBuilds = [];
	$scope.allBuildTypes = [];
	$scope.allLastCompletedBuilds = [];
	$scope.filteredLastCompletedBuilds = [];
	$scope.buildTypeFilter = "";

	$scope.allBuilds = teamcityService.getAllBuilds()
		.then(function(builds) {$scope.allBuilds = builds;});

	var getLastCompletedBuilds = function() {
		angular.forEach($scope.allBuildTypes, function(buildType) {
			teamcityService.getBuildsFor(buildType.id)
			.then(function(builds) {
				if (builds.count != 0) {
					if(builds.build[0].status == 'SUCCESS') buildType.status = 'SUCCESS'
					if(builds.build[0].status == 'FAILURE') buildType.status = 'FAILURE'
				} else buildType.status = 'PENDING' 
				$scope.allLastCompletedBuilds.push(buildType);
				$scope.filteredLastCompletedBuilds.push(buildType);
			});
		});
	};

	$scope.allBuildTypes = teamcityService.getAllBuildTypes()
		.then(function(buildTypes) {$scope.allBuildTypes = buildTypes; $scope.filteredLastCompletedBuilds = buildTypes})
		.then(getLastCompletedBuilds)

	$scope.filterBuildTypesBy = function(filterTerm) {
		var regex = new RegExp(filterTerm,"ig");
		$scope.filteredLastCompletedBuilds = $scope.allBuildTypes.filter(function(buildType) {
			return regex.test(JSON.stringify(buildType));
		});
	}
}]);
