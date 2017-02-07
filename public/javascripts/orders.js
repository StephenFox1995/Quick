(function () {
  angular
    .module('orders', [
      'session'
    ])
    .factory('ordersService', ordersService);

  ordersService.inject = ['$http', "$interval", 'sessionService'];
  function ordersService($http, $interval, sessionService) {
    return {
      getOrderQueue: getOrderQueue,
      beginOrderService: beginOrderService,
      getOrder: getOrder,
      observeOrderQueue: observeOrderQueue,
      getOrdersFromResponseData: getOrdersFromResponseData
    };

    
    /**
     * Request an order by id.
     */
    function getOrder(id) {
      return new Promise(function(resolve, reject) {
        $http.get('/order/' + id).then(resolve, reject);
      });
    }

    /**
     * Merges order data with that of task data.
     */
    function getOrderAndMergeWithTask(id, task) {
      return new Promise(function(resolve, reject) {
        getOrder(id).then(function(response) {
          order = response.data.order;
          var merged = {
            createdAt: task.createdAtISO,
            release: task.releaseISO,
            deadline: task.deadlineISO,
            processing: task.processing,
            workerID: task.assignedWorkerID,
            products: order.products,
            cost: order.cost,
            id: order.id
          };
          resolve(merged);
        }).catch(function(err) {
          reject(err);
        });
      })
    }

    /**
     * Begins a new order queue worker by calling
     * the proactive module. This will monitor the orders
     * for the current business.
     */  
    function beginOrderService() {
      return new Promise(function(resolve, reject) {
        let url =  'http://localhost:6566/beginservice';
        let postData = {
          business: {
            id: sessionService.getClientID(),
            workers:[
          	  { name: "Andrew Worker", id: "W_Andrew", multitask: 2},
              { name: "Sinead Worker", id: "W_Sinead", multitask: 2 },
              { name: "Stephen Worker", id: "W_Stephen", multitask: 2 }
            ]
          },
          refresh: 2000
        }
        $http.post(url, postData).then(resolve, reject);
      });
    }

    /**
     * Gets the orders from the proactive module.
     * These orders are expected to be ordered correctly
     * according to their release times.
     */
    function getOrderQueue(callback) {
      return new Promise(function(resolve, reject) {
        let url =  'http://localhost:6566/tasks?id=' + sessionService.getClientID();
        $http.get(url).then(resolve, reject);
      });
    }    

    /**
     * Observes the priority queue by sending
     * a http GET request every 5 second to check orders.
     */
    function observeOrderQueue(callback, refresh) {
      $interval(function() {
        getOrderQueue().then(function(data) {
            callback(null, data);
          }).catch(function(data) {
            callback(new Error("A network error orccured."));
          });
      }, refresh);
    };

    function getOrdersFromResponseData(data, callback) {
      let orderRequestPromises = data.map(function(task) { 
        return getOrderAndMergeWithTask(task.id, task);
      })
      Promise.all(orderRequestPromises).then(function(data) {
        callback(data);
      })
    }
  }
})();
