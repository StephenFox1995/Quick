(function () {
  'use strict';
  angular
  .module('businessHome', [
    'session'
  ])
  .controller('BusinessHomeController', BusinessHomeController);
    
  BusinessHomeController.inject = ['$scope'];
  function BusinessHomeController($scope) {
    $scope.welcomeMessage = 'Welcome';
  };

})();