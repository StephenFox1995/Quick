(() => {
  angular
    .module('orders')
    .controller('OrdersController', OrdersController);

  OrdersController.inject = ['$scope', 'ordersService', 'sessionService', 'vis.DataSet'];
  function OrdersController($scope, ordersService, sessionService, VisDataSet) {
    const lScope = $scope;
    lScope.businessName = sessionService.getClientName();
    lScope.orders = [];
    lScope.employeeToAdd = {};
    lScope.statusMessage = 'Loading orders...';
    lScope.addEmployeeMessage = '';
    lScope.timelineData = [];
    lScope.data = { items: new VisDataSet(lScope.timelineData) };
    lScope.options = {
      autoResize: true,
      rollingMode: true,
    };
    function setTimeline(orders) {
      const timelineData = orders.map(function (order) {
        return {
          id: order.id,
          content: order.workerID,
          start: order.release,
          end: order.deadline,
        };
      });
      lScope.data = { items: new VisDataSet(timelineData) };
    }

    function handleQueueUpdates(err, response) {
      ordersService.getOrdersFromResponseData(response.data, (data, error) => {
        if (error) {
          lScope.statusMessage = error.message;
        } else {
          lScope.statusMessage = 'Loaded';
          lScope.orders = data;
          setTimeline(data);
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
          if (err.status === 400) {
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
