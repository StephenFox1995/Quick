(function () {
  'use strict';

  angular.module('products', [])
    .factory('productsService', productsService);

  productsService.inject = ['$http'];
  function productsService($http) {
    return {
      getProducts: getProducts 
    };

    function getProducts(businessID, callback) {
      $http.get('/business/' + businessID + '/products')
        .success(function (data) {
          callback(null, data.products);
        })
        .error(function (data) {
          callback(new Error('Could not retrieve products for business: ' + businessID));
        });
    }
  }
})();