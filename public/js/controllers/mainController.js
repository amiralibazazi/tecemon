var module = angular.module('tecemonController', ['teamcityservice', 'filters']);

module.controller('mainController', ['$scope', '$q', '$interval', 'teamcityService', 'tecemonService',
							function($scope, $q, $interval, teamcityService, tecemonService) {
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
		console.log("Refreshing Filters");
		getLastCompletedBuilds()
		.then($scope.applyFilterToAllBuilds($scope.currentFilterObject.filterTerm, $scope.currentFilterObject.name));
		$scope.getAllFilters();
	}

	$scope.getAllFilters = function() {
		console.log("Refreshing Filters");
		tecemonService.getAllFilters()
		.then(function(filters) {
			$scope.savedFilters = filters
		});
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
		console.log("Saving new filter : " + name)
		tecemonService.save((newFilter(filterTerm, name)))
		$scope.getAllFilters();
	}

	$scope.removeFilterTerm = function(filterObject) {
		tecemonService.deleteFilter(filterObject)
		$scope.getAllFilters();
	}

	$scope.allBuildTypes = teamcityService.getAllBuildTypes()
		.then(function(buildTypes) {$scope.allBuildTypes = buildTypes; $scope.filteredLastCompletedBuilds = buildTypes})
		.then(getLastCompletedBuilds)

	$scope.getAllFilters();
	$interval(refreshView, 10000);
}]);
