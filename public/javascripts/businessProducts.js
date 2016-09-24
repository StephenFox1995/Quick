(function() {
  'use strict';

  angular
    .module('businessProducts', ['products', 'session'])
    .controller('BusinessProductsController', BusinessProductsController);
  
  BusinessProductsController.inject = ['$scope', 'productsService', 'sessionService'];
  function BusinessProductsController($scope, productsService, sessionService) {
    $scope.products = [];

    (function getProducts() {
      // Get the id of the business.
      var businessID = sessionService.getClientID();
      productsService.getProducts(businessID, function(err, products) {
        if (err) { /* todo: display to user that products could not be loaded.*/ }
        $scope.products = products;
      });
    })();
  }
})();