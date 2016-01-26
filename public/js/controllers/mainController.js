var module = angular.module('tecemonController', ['teamcityservice', 'filters']);

module.controller('mainController', ['$scope', '$q', '$interval', 'teamcityService', 
							function($scope, $q, $interval, teamcityService) {
	$scope.filteredProjects = [];
	$scope.allBuildTypes = [];
	$scope.allLastCompletedBuilds = [];
	$scope.filteredLastCompletedBuilds = [];
	$scope.savedFilters = [];
	$scope.buildTypeFilter = "";
	$scope.filterName = "";
	$scope.defaultFilterObject = {"id": null, "filterTerm": "", "name": ""}
	$scope.currentFilterObject = $scope.defaultFilterObject;

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

	var newFilter = function(filterTerm, name) {
		return filterObject = {
			"id": Date.now(),
			"filterTerm": filterTerm,
			"name": name
		}
	}

	var refreshView = function() {
		console.log("Refreshing View");
		getLastCompletedBuilds()
		.then($scope.applyFilterToAllBuilds($scope.currentFilterObject.filterTerm, $scope.currentFilterObject.name))
	}

	$scope.applyFilterToAllBuilds = function(filterTerm, name) {
		if (name) $scope.filterName = name;
		var regex = new RegExp(filterTerm,"ig");
		$scope.currentFilterObject = newFilter(filterTerm, name);
		$scope.filteredLastCompletedBuilds = $scope.allBuildTypes.filter(function(buildType) {
			return regex.test(JSON.stringify(buildType));
		});
	}

	$scope.saveFilterObject = function(filterTerm, name) {
		if (name == "") {name = filterTerm};
		$scope.savedFilters.push(newFilter(filterTerm, name));
	}

	$scope.removeFilterTerm = function(filterObject) {
		for (var i = $scope.savedFilters.length - 1; i >= 0; i--) {
    		if ($scope.savedFilters[i].id === filterObject.id) {$scope.savedFilters.splice(i, 1);}
		}
	}

	$scope.allBuildTypes = teamcityService.getAllBuildTypes()
		.then(function(buildTypes) {$scope.allBuildTypes = buildTypes; $scope.filteredLastCompletedBuilds = buildTypes})
		.then(getLastCompletedBuilds)

	$interval(refreshView, 10000);
}]);
