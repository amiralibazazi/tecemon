var filters = angular.module('filters', []);

filters.filter('statusSorter', function() {
  return function(builds, field) {
    var sortedBuilds = [];
    angular.forEach(builds, function(build) {
      sortedBuilds.push(build);
    });
    sortedBuilds.sort(function (left, right) {    
        if (left.status == right.status) return 0;
    	if (left.status == 'SUCCESS') return 1;
    	if (left.status == 'FAILURE') return -1;
    	if (left.status == 'PENDING' && right.status == 'FAILURE') return 1;
    	if (left.status == 'PENDING' && right.status == 'SUCCESS') return -1;
    });
    return sortedBuilds;
  };
});
