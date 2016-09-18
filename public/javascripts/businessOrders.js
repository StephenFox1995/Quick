(function () {
  'use strict';

  angular
  .module('businessOrders', [
    'session',
    'orders'
  ])
  .controller('BusinessOrdersController', BusinessOrdersController)
  .factory('ordersView', ordersView);

  BusinessOrdersController.inject = ['$scope', 'ordersView'];
  function BusinessOrdersController($scope, ordersView) {
    $scope.purchases;
    (function getOrders() {
      ordersView.getOrders(function (err, data) {
        if (err) {
        // Display error.
        }
        $scope.purchases = data.purchases;
      });
    })();
  }


  ordersView.inject = ['$http', 'ordersService'];
  function ordersView($http, ordersService) {
    return {
      getOrders: getOrders
    };

    function getOrders(callback) {
      ordersService.getOrders(function(data) {
        validateResponse(data) ? callback(null, data): callback(new Error, data);
      });
    }

    function validateResponse(data) {
      return data.success;
    }
  }
})();