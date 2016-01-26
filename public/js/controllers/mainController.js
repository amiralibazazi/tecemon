var module = angular.module('tecemonController', ['teamcityservice', 'filters']);

module.controller('mainController', ['$scope', '$q', '$interval', 'teamcityService', 
							function($scope, $q, $interval, teamcityService) {
	$scope.filteredProjects = [];
	$scope.allBuildTypes = [];
	$scope.allLastCompletedBuilds = [];
	$scope.filteredLastCompletedBuilds = [];
	$scope.savedFilters = [];
	$scope.buildTypeFilter = "";
	$scope.currentFilter = "";

	var getLastCompletedBuilds = function() {
		var lastCompletedBuilds = [];		
		angular.forEach($scope.allBuildTypes, function(buildType) {
			teamcityService.constructLastCompletedBuildFor(buildType)
			.then(function(build) {
				lastCompletedBuilds.push(build);
			});
		});
		$scope.allLastCompletedBuilds = lastCompletedBuilds;
		return $q.defer().promise;
	};

	$scope.filterBuildTypesBy = function(filterTerm) {
		$scope.currentFilter = filterTerm;
		var regex = new RegExp($scope.currentFilter,"ig");
		$scope.filteredLastCompletedBuilds = $scope.allBuildTypes.filter(function(buildType) {
			return regex.test(JSON.stringify(buildType));
		});
	}

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

	$scope.changeInputTextTo = function(savedFilter) {
		console.log("SAVED FILTER BEFORE : " + $scope.buildTypeFilter)
		$scope.buildTypeFilter = savedFilter;
		console.log("SAVED FILTER AFTER : " + $scope.buildTypeFilter)
	}

	var refreshView = function() {
		console.log("Refreshing View");
		getLastCompletedBuilds()
		.then($scope.filterBuildTypesBy($scope.currentFilter))
	}

	$interval(refreshView, 10000);
}]);
