var tecemonService = angular.module('tecemonservice', []);

tecemonService.service('tecemonService', ['$http', '$q', function($http, $q) {
	var tecemonService = this;

	tecemonService.hello = function() {
		$http.get('/hello')
			.then(function(response) {
				return response.data;
			})
	};
}]);