(function() {
  'use strict';
  angular
  .module('orders')
  .controller('OrdersController', OrdersController);

  OrdersController.inject = ['$scope', 'ordersService'];
  function OrdersController($scope, ordersService) {
    $scope.orders = [];
    (function getOrders() {
      ordersService.getOrders(function(err, data) {
        if (err) { /**Display to business that orders could not be displayed. */}
        $scope.orders = data.orders;
        console.log($scope.orders);
      });
    })();    
  };
})();