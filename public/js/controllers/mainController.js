var module = angular.module('tecemonController', ['teamcityservice', 'filters']);

module.controller('mainController', ['$scope', '$q', '$interval', 'teamcityService', 'filterService',
							function($scope, $q, $interval, teamcityService, filterService) {
	$scope.allBuildTypes = [];
	$scope.allLastCompletedBuilds = [];
	$scope.filteredLastCompletedBuilds = [];
	$scope.savedFilters = [];
	$scope.defaultFilter = {id: null,filterTerm: '',name: ''};
	$scope.currentFilter = $scope.defaultFilter;

	$scope.checkboxes = {
       SUCCESS : true,
       PENDING : true,
       FAILURE : true
    };

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

	var withId = function(filter) {
		var min = 100000000000; var max = 900000000000
		filter.id = Math.floor(Math.random() * (max - min)) + min;
		return filter;
	}

	var refreshView = function() {
		console.log("Refreshing View");
		getLastCompletedBuilds()
		.then($scope.applyFilterToAllBuilds($scope.currentFilter));
	}

	$scope.getAllFilters = function() {
		console.log("Refreshing Filters : " + JSON.stringify($scope.savedFilters));
		filterService.getAllFilters()
		.then(function(filters) {
			$scope.savedFilters = filters
		});
	}

	$scope.applyFilterToAllBuilds = function(filter) {
		var regex = new RegExp(filter.filterTerm,"ig");
		$scope.currentFilter = filter;
		$scope.filteredLastCompletedBuilds = $scope.allBuildTypes.filter(function(buildType) {
			return regex.test(JSON.stringify(buildType));
		});
	}

	$scope.saveFilter = function(filter) {
		if (!filter.name) {filter.name = filter.filterTerm};
		console.log("Saving new filter : " + filter.name)
		filterService.save(withId(filter))
		$scope.getAllFilters();	
	}

	$scope.removeFilterTerm = function(filter) {
		filterService.deleteFilter(filter)
		$scope.getAllFilters();
	}

	$scope.allBuildTypes = teamcityService.getAllBuildTypes()
		.then(function(buildTypes) {$scope.allBuildTypes = buildTypes; $scope.filteredLastCompletedBuilds = buildTypes})
		.then(getLastCompletedBuilds)

	$scope.getAllFilters();
	$interval(refreshView, 10000);
}]);
