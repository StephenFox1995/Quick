(() => {
  angular
    .module('orders')
    .controller('OrdersController', OrdersController);

  OrdersController.inject = ['$scope', 'ordersService', 'sessionService'];
  function OrdersController($scope, ordersService, sessionService) {
    let lScope = $scope;
    lScope.businessName = sessionService.getClientName();
    lScope.orders = [];
    lScope.statusMessage = 'Loading orders...';

    function handleQueueUpdates(err, response) {
      ordersService.getOrdersFromResponseData(response.data, (data) => {
        lScope.orders = data;
        lScope.statusMessage = 'Loaded';
      });
    }

    (function () {
      ordersService.beginOrderService()
        .then(() => {
          ordersService.observeOrderQueue(handleQueueUpdates, 5000);
        })
        .catch(() => {
          lScope.statusMessage = 'Could not load orders';
        });
    }());
  }
})();
