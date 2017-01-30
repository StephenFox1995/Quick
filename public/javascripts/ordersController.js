(function() {
  'use strict';
  angular
  .module('orders')
  .controller('OrdersController', OrdersController);

  OrdersController.inject = ['$scope', 'ordersService', 'sessionService'];
  function OrdersController($scope, ordersService, sessionService) {
    $scope.businessName = sessionService.getClientName();
    $scope.orders = [];
    
    (function beginPriorityQueue() {
      ordersService.beginPriorityQueue()
        .then(function(resolve, reject) {
          ordersService.observePriorityQueue(function(err, data) {
            console.log(data);
          }, 10000);
        });
    })();
  };
})();