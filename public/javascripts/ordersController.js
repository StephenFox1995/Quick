(() => {
  angular
    .module('orders')
    .controller('OrdersController', OrdersController);

  OrdersController.inject = ['$scope', 'ordersService', 'sessionService'];
  function OrdersController($scope, ordersService, sessionService) {
    const lScope = $scope;
    lScope.businessName = sessionService.getClientName();
    lScope.orders = [];
    lScope.employeeToAdd = {};
    lScope.statusMessage = 'Loading orders...';
    lScope.addEmployeeMessage = '';

    function handleQueueUpdates(err, response) {
      ordersService.getOrdersFromResponseData(response.data, (data, error) => {
        if (error) {
          lScope.statusMessage = error.message;
        } else {
          lScope.orders = data;
          lScope.statusMessage = 'Loaded';
        }
      });
    }

    (function initialize() {
      ordersService.beginOrderService()
        .then(() => {
          ordersService.observeOrderQueue(handleQueueUpdates, 5000);
        })
        .catch((err) => {
          // Process already exists, thats ok, now fetch orders.
          if (err.status) {
            ordersService.observeOrderQueue(handleQueueUpdates, 5000);
          } else {
            lScope.statusMessage = 'Could not load orders';
          }
        });
    }());

    lScope.addEmployee = () => {
      ordersService.addEmployee(lScope.employeeToAdd)
        .then(() => {
          lScope.addEmployeeMessage = 'Employee Added';
        }).catch(() => {
          lScope.addEmployeeMessage = 'Could not add employee';
        });
    };
  }
})();
