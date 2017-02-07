(function() {
  'use strict';
  angular
  .module('orders')
  .controller('OrdersController', OrdersController);

  OrdersController.inject = ['$scope', 'ordersService', 'sessionService'];
  function OrdersController($scope, ordersService, sessionService) {
    $scope.businessName = sessionService.getClientName();
    $scope.orders = [];
    (function () {
      ordersService.beginOrderService().then(function(data) {
        ordersService.observeOrderQueue(function(err, response) {
          ordersService.getOrdersFromResponseData(response.data, function(data) {
            $scope.orders = data;
          });
        }, 10000);
      }).catch(function(err) {
        console.log("Could not begin priority queue")
      });
    })();
  };
})();