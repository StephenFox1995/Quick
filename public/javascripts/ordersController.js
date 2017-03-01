(() => {
  angular
    .module('orders')
    .controller('OrdersController', OrdersController);

  OrdersController.inject = ['$scope', 'ordersService', 'sessionService', 'VisDataSet', '$interval', 'predictionService'];
  function OrdersController($scope, ordersService, sessionService, VisDataSet, $interval, predictionService) {
    const lScope = $scope;
    lScope.businessName = sessionService.getClientName();
    lScope.orders = [];
    lScope.employeeToAdd = {};
    lScope.statusMessage = '';
    lScope.addEmployeeMessage = '';
    lScope.timelineData = [];
    lScope.employees = [];
    lScope.ignoreNewOrdersCheck = false;
    lScope.queueMonitor = null;
    lScope.options = {
      autoResize: true,
      rollingMode: true,
      start: Date.now(),
      end: (Date.now() + (30 * 10000)),
    };

    function setTimeline(orders) {
      const timelineData = orders.map((order) => {
        const content = order.workerID || 'Unassigned';
        return {
          id: order.id,
          content,
          start: order.release,
          end: order.deadline,
        };
      });
      lScope.data = { items: new VisDataSet(timelineData) };
    }

    /**
     * Sets the ui for all elements that depend on orders.
     */
    function setOrders(orders) {
      lScope.statusMessage = '';
      lScope.orders = orders;
      setTimeline(orders);
    }

    /**
     * Checks to see if the new data that was fetched
     * is the exact same as the data we already have in cache.
     */
    function containsNewOrders(newOrders) {
      const cachedIDs = lScope.orders.map(order => order.id);
      const result = newOrders.filter(o => cachedIDs.indexOf(o.id) === -1);
      return result.length > 0;
    }

    function monitorQueue() {
      ordersService.getOrderQueue()
        .then((data) => {
          if (lScope.ignoreNewOrdersCheck) {
            setOrders(data.orders);
            lScope.ignoreNewOrdersCheck = false;
            lScope.utilization = data.utilization;
          } else if (containsNewOrders(data.orders)) {
            setOrders(data.orders);
            lScope.utilization = data.utilization;
          }
        })
        .catch(() => {
          lScope.statusMessage = 'Could not load orders';
        });

      ordersService.getEmployees()
        .then((response) => {
          lScope.employees = response.data.workers;
        })
        .catch(() => {
          lScope.statusMessage = 'Could not load employees';
        });
      
      predictionService.orderPredictionCurrentHour()
        .then((response) => {
          lScope.expectedOrders = response.data.predictions.data[0].data.prediction
        })
        .catch(() => {

        });
    }

    // Begins the service to monitor orders.
    lScope.begin = (multitask) => {
      // first check local storage if a task has already begun.
      if (localStorage.getItem('serviceStarted') === 'true') {
        lScope.queueMonitor = $interval(monitorQueue, 1000);
      } else {
        ordersService.beginOrderService(multitask)
          .then(() => {
            localStorage.setItem('serviceStarted', true);
            localStorage.setItem('multitask', multitask);
            lScope.statusMessage = 'Loaded';
            lScope.queueMonitor = $interval(monitorQueue, 1000);
          })
          .catch((err) => {
            if (err.status === 400) {
              lScope.queueMonitor = $interval(monitorQueue, 1000); // Process already exists, thats ok, now fetch orders.
            } else {
              lScope.statusMessage = 'Could not load orders';
              lScope.$apply();
            }
          });
      }
    };

    lScope.shutdown = () => {
      ordersService.shutdownOrderServer()
        .then(() => {
          lScope.statusMessage = 'Successfully shutdown'
          $interval.cancel(lScope.queueMonitor);
          localStorage.setItem('serviceStarted', false);
          lScope.$apply();
        })
        .catch((data) => {
          lScope.statusMessage = 'Could not shutdown.'
          lScope.$apply();
        })
    }


    // Adds an employee to start handling tasks.
    lScope.addEmployee = () => {
      lScope.employeeToAdd.multitask = localStorage.getItem('multitask');
      ordersService.addEmployee(lScope.employeeToAdd)
        .then(() => {
          lScope.ignoreNewOrdersCheck = true;
          lScope.addEmployeeMessage = 'Employee Added';
        }).catch(() => {
          lScope.addEmployeeMessage = 'Could not add employee';
        });
    };

    lScope.removeEmployee = (employeeID) => {
      ordersService.removeEmployee(employeeID);
    }
    
    lScope.finishOrder = (order) => {
      ordersService.finishOrder(order);
      lScope.ignoreNewOrdersCheck = true;
    };


    (() => {
      if (localStorage.getItem('serviceStarted') === 'true') {
        lScope.queueMonitor = $interval(monitorQueue, 1000);
      }
    })();
  }
})();
