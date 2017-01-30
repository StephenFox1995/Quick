(function () {
  angular
    .module('orders', [
      'session'
    ])
    .factory('ordersService', ordersService);

  ordersService.inject = ['$http', "$interval", 'sessionService'];
  function ordersService($http, $interval, sessionService) {
    return {
      getPriorityQueue: getPriorityQueue,
      beginPriorityQueue: beginOrderQueue,
      getOrder: getOrder,
      observePriorityQueue: observePriorityQueue
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
    function beginOrderQueue() {
      return new Promise(function(resolve, reject) {
        let url =  'http://localhost:6566/beginWorker';
        let postData = {
          business: {
            businessID: sessionService.getClientID(),
          },
          refresh: 5000
        };
        $http.post(url, postData).then(resolve, reject);
      });
    }

    /**
     * Gets the orders from the proactive module.
     * These orders are expected to be ordered correctly
     * according to their release times.
     */
    function getPriorityQueue(callback) {
      return new Promise(function(resolve, reject) {
        let url =  'http://localhost:6566/queue?id=' + sessionService.getClientID();
        $http.get(url).then(resolve, reject);
      });
    }    

    /**
     * Observes the priority queue by sending
     * a http GET request every 5 second to check the
     * priorities of each order.
     */
    function observePriorityQueue(callback, refresh) {
      $interval(function() {
        getPriorityQueue()
          .then(function(data) {
            callback(null, data);
          })
          .catch(function(data) {
            callback(new Error("A network error orccured."));
          });
      }, refresh);
    };
  }
})();
