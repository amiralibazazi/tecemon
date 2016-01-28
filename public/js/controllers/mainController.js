var module = angular.module('tecemonController', ['teamcityservice', 'filters']);

module.controller('mainController', ['$scope', '$q', '$interval', 'teamcityService', 'tecemonService',
							function($scope, $q, $interval, teamcityService, tecemonService) {
	$scope.allBuildTypes = [];
	$scope.allLastCompletedBuilds = [];
	$scope.filteredLastCompletedBuilds = [];
	$scope.savedFilters = [];
	$scope.defaultFilter = {id: null,filterTerm: '',name: ''};
	$scope.currentFilter = $scope.defaultFilter;

	$scope.checkboxModel = {
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
		tecemonService.getAllFilters()
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
		tecemonService.save(withId(filter))
		$scope.getAllFilters();	
	}

	$scope.removeFilterTerm = function(filter) {
		tecemonService.deleteFilter(filter)
		$scope.getAllFilters();
	}

	$scope.allBuildTypes = teamcityService.getAllBuildTypes()
		.then(function(buildTypes) {$scope.allBuildTypes = buildTypes; $scope.filteredLastCompletedBuilds = buildTypes})
		.then(getLastCompletedBuilds)

	$scope.getAllFilters();
	$interval(refreshView, 10000);
}]);
