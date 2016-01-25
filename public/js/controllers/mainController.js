var module = angular.module('tecemonController', ['teamcityservice', 'filters']);

module.controller('mainController', ['$scope', '$q', '$interval', 'teamcityService', 
							function($scope, $q, $interval, teamcityService) {
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
		var retrievedBuilds = [];
		angular.forEach($scope.allBuildTypes, function(buildType) {
			teamcityService.getBuildsFor(buildType.id)
			.then(function(builds) {
				if (builds.count != 0) {
					if(builds.build[0].status == 'SUCCESS') buildType.status = 'SUCCESS'
					if(builds.build[0].status == 'FAILURE') buildType.status = 'FAILURE'
				} else buildType.status = 'PENDING' 
				retrievedBuilds.push(buildType);
			});
		});
		$scope.allLastCompletedBuilds = retrievedBuilds;
		return $q.defer().promise;
	};

	$scope.saveFilterTerm = function(filterTerm) {
		$scope.savedFilters.push(filterTerm);
		$scope.filterBuildTypesBy(filterTerm);
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

	var refreshView = function() {
		console.log("View refreshed");
		console.log("Here's a random number: " + Math.random())
		getLastCompletedBuilds()
		.then($scope.filterBuildTypesBy($scope.buildTypeFilter))
		
	}

	$interval(refreshView, 10000);
}]);
