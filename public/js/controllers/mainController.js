var module = angular.module('tecemonController', ['teamcityservice', 'filters']);

module.controller('mainController', ['$scope', 'teamcityService', function($scope, teamcityService) {
	$scope.allProjects = [];
	$scope.filteredProjects = [];
	$scope.allBuilds = [];
	$scope.allBuildTypes = [];
	$scope.allLastCompletedBuilds = [];
	$scope.filteredLastCompletedBuilds = [];
	$scope.savedFilters = [];
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

	$scope.saveFilterTerm = function(filterTerm) {
		$scope.savedFilters.push(filterTerm)
	}

	$scope.removeFilterTerm = function(filterTerm) {
		for (var i = $scope.savedFilters.length - 1; i >= 0; i--) {
    		if ($scope.savedFilters[i] === filterTerm) {array.splice(i, 1);}
		}
	}

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
