(function() {
  'use strict';

  angular
    .module('products', [
      'session', 
      'dropper',
      'alert',
    ])
    .controller('ProductsController', ProductsController);

  ProductsController.inject = ['$scope', 'productsService', 'sessionService'];
  function ProductsController($scope, productsService, sessionService) {
    $scope.products = [];
    $scope.selectedProduct = {}; // The object that was selected for editing.
    $scope.showAlert = false;
    $scope.editingProduct = null;
    $scope.EditingProduct = {};
    $scope.businessName = sessionService.getClientName();

    // Load the products.
    (function getProducts() {
      // Get the id of the business.
      var businessID = sessionService.getClientID();
      productsService.getProducts(businessID, function(err, products) {
        if (err) { /* todo: display to user that products could not be loaded.*/ }
        $scope.products = products;
      });
    })();

    // Presents a modal view to edit product.
    $scope.modalPresented = function(index) {
      // Define prototpye of Editing product.
      $scope.EditingProduct = {
        index: 0, // Index of the editing object.
        beforeEdit: {}, // Object representation before edit
        afterEdit: {} //// Object representation after edit
      };
      // Create instance for produt being edited.
      $scope.editingProduct = Object.create($scope.EditingProduct);

      // Hide any previous alerts.
      $scope.showAlert = false;

      // Reset the selectedProduct, incase there was a previous product selected.
      $scope.selectedProduct = {};

      $scope.editingProduct.index = index; // Set the index of the selected product.

      // We want copy and not reference incase user decides that they don't
      // actually want to update the product and press cancel.
      // This keeps the array consistent to what was loaded from the server.
      angular.copy($scope.products[index], $scope.selectedProduct);
      
      // Set the beforeEdit object so we can monitor any updates,
      // again we want copy and not reference so we can grab
      // a snapshot of the object before editing.
      angular.copy($scope.selectedProduct, $scope.editingProduct.beforeEdit);
    };

    $scope.removeProduct = function(product) {
      // Send http request to remove the product.
      // And remove from local data source, as no need to
      // fetch again from server.
      productsService.removeProduct(product, function(err) {
        if (err) { return; /*Silently fail*/}
        
        var products = $scope.products;
        for (var i = 0; i < products.length; i++) {
          if (products[i].id === product.id) {
            products.splice(i, 1);
          }
        }
      });
    };

    $scope.updateProduct = function() {
      // Hide any previous alerts.
      $scope.showAlert = false;
      
      // Get a copy of the selectedProduct, and not reference as the
      // user can still edit the selectedProduct after clicking 'save'
      // so make sure this was the snapshot of the object when the user clicked 'save'.
      angular.copy($scope.selectedProduct, $scope.editingProduct.afterEdit);

      var beforeEdit = $scope.editingProduct.beforeEdit;
      var afterEdit = $scope.editingProduct.afterEdit;
      productsService.getUpdates(beforeEdit, afterEdit, function(err, detectedUpdates, updates) {
        if (err) { return; /*Silently return */};
        if (detectedUpdates) {
          var httpBody = {};
          httpBody.updatedProduct = updates;

          productsService.updateProduct(httpBody, function(err, data) {
            if (err) {
              $scope.showAlert = true;
              $scope.alertStyle = 'danger'; 
              $scope.alertTitle = 'Error';
              $scope.alertMessage = 'There was a problem saving the product, please try again.';
              return;
            }
            $scope.showAlert = true;
            $scope.alertStyle = 'success'; 
            $scope.alertTitle = 'Success';
            $scope.alertMessage = 'Product was saved!';
            
            $scope.dataReflectsUpdate($scope.products, 
                                      $scope.editingProduct.index, 
                                      $scope.editingProduct.afterEdit);
            $scope.resetEditsAfterUpdate($scope.editingProduct);
          });
        } else {
          $scope.showAlert = true;
          $scope.alertStyle = 'info'; 
          $scope.alertTitle = 'Info';
          $scope.alertMessage = 'No changes made';
          return; // No need to update no updates occurred.
        }
      });
    };

    $scope.resetEditsAfterUpdate = function(editingProduct) {
      if (!$scope.EditingProduct.isPrototypeOf($scope.editingProduct)) {
        return;
      }
      // As the user can make multiple changes with one modal,
      // it is important that the correct edits of the product are updated.
      // Once a successful update has been made, the afterEdit is no longer the
      // afterEdit, it becomes the beforeEdit as the user may update the product again,
      // therefore set the beforeEdit to reference the afterEdit, which is currently
      // the newest version of the product.
      editingProduct.beforeEdit = editingProduct.afterEdit;
      // There is no longer a afterEdit as we have reset the edits after a successful update.
      editingProduct.afterEdit = {};
    };

    // Ensures our datasource of products which was fetched
    // from the newtwork on page load, reflects the updates made after
    // the product was edited.
    // However for performance, there's no need to send a network
    // request again to update the datasource, just simply update 
    // the record, using this method.
    $scope.dataReflectsUpdate = function(originalDataSource, index, updatedRecord) {
      originalDataSource[index] = updatedRecord;
    };
  }
})();
