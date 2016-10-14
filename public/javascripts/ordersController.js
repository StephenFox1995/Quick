(function() {
  'use strict';
  angular
  .module('orders')
  .controller('OrdersController', OrdersController);

  OrdersController.inject = ['$scope', 'ordersService', 'sessionService'];
  function OrdersController($scope, ordersService, sessionService) {
    $scope.businessName = sessionService.getClientName();
    $scope.orders = [];

    (function getOrders() {
      ordersService.getOrders(function(err, data) {
        if (err) { /**Display to business that orders could not be displayed. */}
        $scope.orders = data.orders;
      });
    })();    
  };
})();