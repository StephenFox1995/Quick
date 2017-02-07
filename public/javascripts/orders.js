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
        $http.get('/order').then(resolve, reject);
      });
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

//  {
//     "processing": 200,
//     "createdAtISO": "2017-01-28T14:26:45.780000",
//     "releaseISO": "2017-01-28T14:28:32.780000",
//     "profit": 2.2,
//     "deadlineISO": "2017-01-28T14:31:52.780000",
//     "assignedWorkerID": "W_Andrew",
//     "id": "588ded22206e88b4547367b6"
//   },
    function getOrdersFromResponseData(response, callback) {
      var orderIDs = response.map(function(x) { return x.id; });
      let orderRequestPromises = orderIDs.map(function(orderID) { 
        return getOrder(orderID);
      })
      Promise.all(orderRequestPromises).then(function(data) {
        callback(data);
      })
    }

    // function getOrdersFromQueue(queue, callback) {
    //   let orderIDs = queue.map(function(x) { x.id; });
    //   let orderRequestPromises = orderIDs.map(function(orderID) {
    //     getOrder(orderID);
    //   });
    //   Promise.all(orderRequestPromises).then(function(values) {
    //     callback(null, values);
    //   });
    // }
  }
})();
