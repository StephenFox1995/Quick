(() => {
  angular
    .module('orders', [
      'session',
      'ngVis',
    ])
    .factory('ordersService', ordersService);

  ordersService.inject = ['$http', '$interval', 'sessionService'];
  function ordersService($http, $interval, sessionService) {
    return {
      getOrderQueue,
      beginOrderService,
      getOrder,
      observeOrderQueue,
      getOrdersFromResponseData,
      addEmployee
    };
    /**
     * Request an order by id.
     */
    function getOrder(id) {
      return new Promise((resolve, reject) => {
        $http.get(`/order/${id}`).then(resolve, reject);
      });
    }

    /**
     * Merges order data with that of task data.
     */
    function getOrderAndMergeWithTask(id, task) {
      return new Promise((resolve, reject) => {
        getOrder(id).then((response) => {
          const order = response.data.order;
          const merged = {
            createdAt: task.createdAtISO,
            release: task.releaseISO,
            deadline: task.deadlineISO,
            processing: task.processing,
            workerID: task.assignedWorkerID,
            products: order.products,
            cost: order.cost,
            id: order._id,
          };
          resolve(merged);
        }).catch((err) => {
          reject(err);
        });
      });
    }

    /**
     * Begins a new order queue worker by calling
     * the proactive module. This will monitor the orders
     * for the current business.
     */
    function beginOrderService() {
      return new Promise((resolve, reject) => {
        const url = 'http://localhost:6566/beginservice';
        const postData = {
          business: {
            id: sessionService.getClientID(),
            workers: [
              { name: 'Stephen Worker', id: 'W_Stephen', multitask: 3 },
            ],
          },
          refresh: 2000,
        };
        $http.post(url, postData).then(resolve, reject);
      });
    }

    /**
     * Gets the orders from the proactive module.
     * These orders are expected to be ordered correctly
     * according to their release times.
     */
    function getOrderQueue() {
      return new Promise((resolve, reject) => {
        const url = `http://localhost:6566/tasks?id=${sessionService.getClientID()}`;
        $http.get(url).then(resolve, reject);
      });
    }

    /**
     * Observes the priority queue by sending
     * a http GET request every x second to check orders.
     */
    function observeOrderQueue(callback, refresh) {
      $interval(() => {
        getOrderQueue()
        .then((data) => { callback(null, data); })
        .catch(() => { callback(new Error('A network error orccured.')); });
      }, refresh);
    }

    function getOrdersFromResponseData(data, callback) {
      const assignedTasks = data.state.assignedTasks;
      const unassignedTasks = data.state.unassignedTasks;
      const tasks = assignedTasks.concat(unassignedTasks);
      const orderRequestPromises = tasks.map(task => getOrderAndMergeWithTask(task.id, task));
      Promise.all(orderRequestPromises).then(response => callback(response));
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
  }
})();
