(function () {
  angular
    .module('orders', [
      'session'
    ])
    .factory('ordersService', ordersService);

  ordersService.inject = ['$http'];
  function ordersService($http) {
    return {
      getOrders: getOrders
    };

    /**
     * Request orders from the backed for a business.
     */
    function getOrders(callback) {
      // Get all the orders for the business.
      $http.get('/order')
        .success(function (data) {
          return callback(null, data);
        })
        .error(function (data) {
          return callback(new Error('Could not retrieve orders'));
        });
    }
  }
})();