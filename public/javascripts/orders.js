(() => {
  angular
    .module('orders', [
      'session',
      'ngVis',
      'prediction',
      'angularMoment'
    ])
    .factory('ordersService', ordersService);

  ordersService.inject = ['$http', '$interval', 'sessionService', 'moment'];
  function ordersService($http, $interval, sessionService, moment) {
    return {
      getOrderQueue,
      beginOrderService,
      addEmployee,
      finishOrder,
      getEmployees,
      removeEmployee,
      shutdownOrderServer
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

    function shutdownOrderServer() {
      return new Promise((resolve, reject) => {
        const url = `http://localhost:6566/stopservice?id=${sessionService.getClientID()}`;
        $http.get(url).then(resolve, reject);
      });
    }

    function secondsBetweenNowAndThen(now, then) {
      return moment(now).to(then);
    }

    function sortByReleaseDate(a, b) {
      return (a.release < b.release) ? -1 : ((a.release > b.release) ? 1 : 0);
    }

    function parseOrdersFromQueueResponse(response) {
      const assignedTasks = response.state.assignedTasks;
      const unassignedTasks = response.state.unassignedTasks;
      const parse = task => ({
        createdAt: new Date(task.createdAtISO),
        release: new Date(task.releaseISO),
        deadline: new Date(task.deadlineISO),
        processing: task.processing,
        workerID: task.assignedWorkerID,
        products: task.data,
        cost: task.profit,
        deadlineCountdown: secondsBetweenNowAndThen(new Date(), new Date(task.deadlineISO)),
        releaseCountdown: secondsBetweenNowAndThen(new Date(), new Date(task.releaseISO)),
        id: task.id,
      });
      const orders = assignedTasks.map(parse);
      return orders.concat(unassignedTasks.map(parse)).sort(sortByReleaseDate);
    }

    function parseUtlizationFromQueueResponse(response) {
      var utilization = response.state.conflicts.utilization;
      utilization.forEach((u) => {
        u.begin = new Date(u.begin);
        u.end = new Date(u.end);
      });
      return utilization;
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

    function removeEmployee(employeeID) {
      return new Promise((resolve, reject) => {
        $http.delete(`http://localhost:6566/workers?id=${sessionService.getClientID()}&workerID=${employeeID}`)
          .then(resolve, reject);
      });
    }

    function finishOrder(order) {
      return new Promise((resolve, reject) => {
        const dataToSendToQueue = {
          business: {
            id: sessionService.getClientID(),
          },
          taskID: order.id,
        };
        const dataToSendToWebServer = { order };
        const removeTaskPromise = $http.post('http://localhost:6566/removetask', dataToSendToQueue);
        const finishOrderPromise = $http.post(`/order/finish/${order.id}`, dataToSendToWebServer);
        Promise.all([removeTaskPromise, finishOrderPromise]).then(resolve, reject);
      });
    }
  }
})();
