var module = angular.module('tecemonController', ['teamcityservice', 'filters']);

module.controller('mainController', ['$scope', '$q', '$interval', 'teamcityService', 
							function($scope, $q, $interval, teamcityService) {
	$scope.allProjects = [];
	$scope.filteredProjects = [];
	$scope.allBuildTypes = [];
	$scope.allLastCompletedBuilds = [];
	$scope.filteredLastCompletedBuilds = [];
	$scope.savedFilters = [];
	$scope.buildTypeFilter = "";

	var getLastCompletedBuilds = function() {
		var retrievedBuilds = [];
		angular.forEach($scope.allBuildTypes, function(buildType) {
			teamcityService.getBuildsFor(buildType.id)
			.then(function(builds) {
				if (builds.count != 0) {
					if (builds.build[0].state == 'running') {
						buildType.percentageComplete = builds.build[0].percentageComplete;
					}
					if(builds.build[0].status == 'SUCCESS') buildType.status = 'SUCCESS'
					if(builds.build[0].status == 'FAILURE') buildType.status = 'FAILURE'
				} else buildType.status = 'PENDING' 
				if (builds.build) buildType.state = builds.build[0].state;
				retrievedBuilds.push(buildType);
			});
		});
		$scope.allLastCompletedBuilds = retrievedBuilds;
		return $q.defer().promise;
	};

	$scope.saveFilterTerm = function(filterTerm) {
		$scope.savedFilters.push(filterTerm);
	}

	$scope.removeFilterTerm = function(filterTerm) {
		for (var i = $scope.savedFilters.length - 1; i >= 0; i--) {
    		if ($scope.savedFilters[i] === filterTerm) {$scope.savedFilters.splice(i, 1);}
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

	var refreshView = function() {
		getLastCompletedBuilds()
		.then($scope.filterBuildTypesBy($scope.buildTypeFilter))
	}

	$interval(refreshView, 10000);
}]);
