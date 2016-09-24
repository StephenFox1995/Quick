(function() {
  'use strict';

  angular
    .module('businessProducts', ['products'])
    .controller('BusinessProductsController', BusinessProductsController);
  
  BusinessProductsController.inject = ['$scope', 'productsService'];
  function BusinessProductsController($scope, productsService) {
    $scope.products = [];

    (function getProducts() {
      // Mock the id for the time being....
      productsService.getProducts('BJjgTuli', function(err, products) {
        if (err) { /* todo: display to user that products could not be loaded.*/ }
        $scope.products = products;
        console.log(products);
      });
    })();
  }
  
})();