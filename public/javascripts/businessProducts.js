(function() {
  'use strict';

  angular
    .module('businessProducts', [
      'products', 
      'session', 
      'dropper',
      'alert',
      'validNumber'
    ])
    .controller('BusinessProductsController', BusinessProductsController)
    .controller('BusinessProductsCreationController', BusinessProductsCreationController);
  
  BusinessProductsController.inject = ['$scope', 'productsService', 'sessionService'];
  function BusinessProductsController($scope, productsService, sessionService) {
    $scope.products = [];
    $scope.selectedProduct = null;
    $scope.p = {};

    $scope.editingProduct = {
      beforeEdit: {},
      afterEdit: {}
    };

    (function getProducts() {
      // Get the id of the business.
      var businessID = sessionService.getClientID();
      productsService.getProducts(businessID, function(err, products) {
        if (err) { /* todo: display to user that products could not be loaded.*/ }
        $scope.products = products;
      });
    })();

    $scope.showModal = function(index) {
      $scope.selectedProduct = $scope.products[index];
      // Set the before edit product before the user edits it.
      angular.copy($scope.selectedProduct, $scope.editingProduct.beforeEdit);
    };

    $scope.updateProduct = function() {
      $scope.editingProduct.afterEdit = $scope.selectedProduct;
      var beforeEdit = $scope.editingProduct.beforeEdit;
      var afterEdit = $scope.editingProduct.afterEdit;
      productsService.getChanges(beforeEdit, afterEdit, function(err, detectedChanges, changes) {
        if (err) { return; /*Silently return */};
        if (detectedChanges) {
          var httpBody = {};
          httpBody.updatedProduct = changes;

          productsService.updateProduct(httpBody, function(err, data) {
            if (err) {
              // TODO: Tell the user there was an error with the update.
            }
          });
        } else {
          return; // No need to update no changes occurred.
        }
      });
    };
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