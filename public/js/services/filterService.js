var filterService = angular.module('filterservice', []);

filterService.service('filterService', ['$http', '$q', function($http, $q) {
	var filterService = this;

	filterService.save = function(filterTerm) {
		$http.post('/filters', filterTerm)
			.then(function(response) {
				return response;
			});

		return $q.defer().promise;
	};

	filterService.getAllFilters = function() {
		return $http.get('/filters')
			.then(function(response) {
				console.log("Successfully received filters from server : " +  JSON.stringify(response.data));
				return response.data;
			});
	};

	filterService.deleteFilter = function(filter) {
		console.log("Deleting filter with id: " + filter.id)
		return $http.delete('/filters/'+filter.id) 
			.then(function(response) {
				return response;
			});

		return $q.defer().promise;
	};
}]);