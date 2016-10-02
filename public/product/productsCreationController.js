(function () {
  'use strict';
  angular.module('products')
  .controller('ProductsCreationController', ProductsCreationController);

  
  /**
   * ProductsCreationController is the default controller
   * for creating Products.
   */
  ProductsCreationController.inject = ['$scope', 'productsService', 'sessionService', 'Product'];
  function ProductsCreationController($scope, productsService, sessionService, Product) {
    $scope.product = {
      options: []
    };
    $scope.httpBody = {
      product: {}
    };
    $scope.showAlert = false;

    $scope.addProduct = function () {
      // Get the business id.
      var businessID = sessionService.getClientID();
      $scope.product.businessID = businessID;
      // Get copy of product.
      angular.copy($scope.product, $scope.httpBody.product);
      // Convert product options to string. 
      $scope.httpBody.product.options = JSON.stringify($scope.httpBody.product.options);
      
      //TODO:  Perform checks on scope.
      productsService.addProduct($scope.httpBody, function (err, callback) {
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
        $scope.alertMessage = 'Product was added!';
      });
    };
  }
})();

