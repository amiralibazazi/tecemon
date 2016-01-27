var tecemonService = angular.module('tecemonservice', []);

tecemonService.service('tecemonService', ['$http', '$q', function($http, $q) {
	var tecemonService = this;

	tecemonService.save = function(filterTerm) {
		$http.post('/filters', filterTerm)
			.then(function(response) {
				return response;
			});

		return $q.defer().promise;
	};

	tecemonService.getAllFilters = function() {
		return $http.get('/filters')
			.then(function(response) {
				console.log("Successfully received filters from server : " +  JSON.stringify(response.data));
				return response.data;
			});
	};

	tecemonService.deleteFilter = function(filterObject) {
		console.log("Deleting filter with id: " + filterObject.id)
		return $http.delete('/filters/'+filterObject.id) 
			.then(function(response) {
				return response;
			});

		return $q.defer().promise;
	};
}]);