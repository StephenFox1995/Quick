(() => {
  angular
    .module('orders', [
      'session',
      'ngVis',
      'prediction'
    ])
    .factory('ordersService', ordersService);

  ordersService.inject = ['$http', '$interval', 'sessionService'];
  function ordersService($http, $interval, sessionService) {
    return {
      getOrderQueue,
      beginOrderService,
      addEmployee,
      finishOrder,
      getEmployees,
    };

    // Creates a new employee object.
    function worker(name, id, multitask, begin, end) {
      return { name, id, multitask, end };
    }

    /**
     * Begins a new order queue worker by calling
     * the proactive module. This will monitor the orders
     * for the current business.
     */
    function beginOrderService(multitask) {
      return new Promise((resolve, reject) => {
        const url = 'http://localhost:6566/beginservice';
        const postData = {
          business: {
            id: sessionService.getClientID(),
            multitask,
          },
          refresh: 2000,
        };
        $http.post(url, postData).then(resolve, reject);
      });
    }

    function parseOrdersFromQueueResponse(response) {
      const assignedTasks = response.state.assignedTasks;
      const unassignedTasks = response.state.unassignedTasks;
      const parse = task => ({
        createdAt: task.createdAtISO,
        release: task.releaseISO,
        deadline: task.deadlineISO,
        processing: task.processing,
        workerID: task.assignedWorkerID,
        products: task.data,
        cost: task.profit,
        id: task.id,
      });
      const orders = assignedTasks.map(parse);
      return orders.concat(unassignedTasks.map(parse));
    }

    function parseUtlizationFromQueueResponse(response) {
      return response.state.conflicts.utilization;
    }

    /**
     * Gets the orders from the proactive module.
     * These orders are expected to be ordered correctly
     * according to their release times.
     */
    function getOrderQueue() {
      return new Promise((resolve, reject) => {
        const url = `http://localhost:6566/tasks?id=${sessionService.getClientID()}`;
        $http.get(url).then((data) => { // parse out orders.
          const parsed = {
            orders: parseOrdersFromQueueResponse(data.data),
            utilization: parseUtlizationFromQueueResponse(data.data),
          };
          resolve(parsed);
        }).catch(() => { reject(); });
      });
    }

    function addEmployee(employee) {
      return new Promise((resolve, reject) => {
        const dataToSend = {
          business: {
            id: sessionService.getClientID(),
            workers: [employee],
          },
        };
        $http.post('http://localhost:6566/addworkers', dataToSend).then(resolve, reject);
      });
    }

    function getEmployees() {
      return new Promise((resolve, reject) => {
        $http.get(`http://localhost:6566/workers?id=${sessionService.getClientID()}`).then(resolve, reject);
      });
    }

    function finishOrder(orderID) {
      return new Promise((resolve, reject) => {
        const dataToSend = {
          business: {
            id: sessionService.getClientID(),
          },
          taskID: orderID,
        };
        const removeTaskPromise = $http.post('http://localhost:6566/removetask', dataToSend);
        const finishOrderPromise = $http.post(`/order/finish/${orderID}`);
        Promise.all([removeTaskPromise, finishOrderPromise]).then(resolve, reject);
      });
    }
  }
})();
