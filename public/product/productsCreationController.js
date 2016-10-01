(function () {
  'use strict';
  angular.module('products')
  .controller('ProductsCreationController', ProductsCreationController);

  
  /**
   * ProductsCreationController is the default controller
   * for creating Products.
   */
  ProductsCreationController.inject = ['$scope', 'productsService', 'sessionService'];
  function ProductsCreationController($scope, productsService, sessionService) {
    $scope.product;
    $scope.httpBody = {};
    $scope.showAlert = false;

    $scope.addProduct = function () {
      // Get the business id.
      var businessID = sessionService.getClientID();
      $scope.product.businessID = businessID;
      $scope.product.options = $scope.productOptions;
      $scope.httpBody.product = $scope.product;
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

