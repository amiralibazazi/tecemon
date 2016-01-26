(function() {
/* global angular */
var module = angular.module('sidebarcontroller', []);

module.controller('sidebarController', function($scope) {
    
    $scope.state = true;
    
    $scope.toggleState = function() {
        $scope.state = !$scope.state;
    };
    
});

module.directive('sidebarDirective', function() {
    return {
        link : function(scope, element, attr) {
            scope.$watch(attr.sidebarDirective, function(newVal) {
                  if(newVal)
                  {
                    element.addClass('show'); 
                    return;
                  }
                  element.removeClass('show');
            });
        }
    };
});
    
}());