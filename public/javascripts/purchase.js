(function () {
  angular
    .module('purchase', [])
    .factory('purchaseService', purchaseService);

  purchaseService.inject = ['$http'];
  function purchaseService($http) {
    return {
      getUserPurchases: getUserPurchases
    };

    function getUserPurchases(callback) {
      $http.get('/purchase')
        .success(function (data) {
          callback(data);
        })
        .error(function (data) {
          callback(data);
        });
    }
  }
})();


