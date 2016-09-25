(function() {
  'use strict';

  angular
    .module('businessProducts', [
      'products', 
      'session', 
      'dropper',
      'alert'
    ])
    .controller('BusinessProductsController', BusinessProductsController)
    .controller('BusinessProductsCreationController', BusinessProductsCreationController);
  
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

  BusinessProductsCreationController.inject = ['$scope', 'productsService', 'sessionService'];
  function BusinessProductsCreationController($scope, productsService, sessionService) {
    $scope.product;
    $scope.httpBody = {};
    $scope.showAlert = false;
    
    $scope.addProduct = function() {
          
      // Get the business id.
      var businessID = sessionService.getClientID();
      $scope.product.businessID = businessID;
      $scope.httpBody.product = $scope.product;
      //TODO:  Perform checks on scope.
      productsService.addProduct($scope.httpBody, function(err, callback) {
        if (err) {
          $scope.showAlert = true;
          $scope.alertStyle = 'danger'; 
          $scope.alertTitle = 'Error';
          $scope.alertMessage = 'There was a problem trying to add the product, please try again.';
          return; 
        }
        $scope.showAlert = true;
        $scope.alertStyle = 'success'; 
        $scope.alertTitle = 'Success';
        $scope.alertMessage = 'Product was added!.';
      });
    };
  }
})();