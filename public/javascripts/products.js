(function () {
  'use strict';

  angular.module('products', [])
    .factory('productsService', productsService);

  productsService.inject = ['$http'];
  function productsService($http) {
    return {
      getProducts: getProducts,
      addProduct: addProduct
    };

    /**
     * Get products for a business.
     * @param {string} businessID - The id of the business.
     * @param {function(err, data)} callback - Callback function.
     */
    function getProducts(businessID, callback) {
      $http.get('/business/' + businessID + '/products')
        .success(function (data) {
          callback(null, data.products);
        })
        .error(function (data) {
          callback(new Error('Could not retrieve products for business: ' + businessID));
        });
    }
    
    /**
     * Attempts to add a product to the database.
     * @param {Object} product - The product object.
     * @param {function(err, data)} callback - Callback function.
     */
    function addProduct(product, callback) {
      $http.post('/product', product)
      .success(function (data) {
        callback(null, data);
      })
      .error(function (data) {
        callback(new Error('There was an error posting the product'));
      });
    }
  }
})();