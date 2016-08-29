(function () {
  angular
  .module('orders', [])
  .factory('ordersService', ordersService);

  ordersService.inject = ['$http'];
  function ordersService($http) {
    return {
      getOrders: getOrders
    };

    function getOrders(callback) {
      // Get all the purchases for the business.
      $http.get('/business/purchases')
        .success(function (data) {
          callback(data);
        })
        .error(function (data) {
          callback(data);
        });
    }
  }
})();