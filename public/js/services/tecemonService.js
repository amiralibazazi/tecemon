var tecemonService = angular.module('tecemonservice', []);

tecemonService.service('tecemonService', ['$http', '$q', function($http, $q) {
	var tecemonService = this;

	tecemonService.save = function(filterTerm) {
		$http.post('/filters', filterTerm)
			.then(function(response) {
				return response;
			});
	};

	tecemonService.getAllFilters = function() {
		return $http.get('filters')
			.then(function(response) {
				return response;
			});
	}
}]);