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
        beforeEdit: {},
        afterEdit: {}
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


  BusinessProductsCreationController.inject = ['$scope', 'productsService', 'sessionService', '$location', '$anchorScroll', 'ProductOption'];
  function BusinessProductsCreationController($scope, productsService, sessionService, $location, $anchorScroll, ProductOption) {
    $scope.product;
    $scope.httpBody = {};
    $scope.showAlert = false;
    $scope.productOptions = [];
    $scope.showConfigureOptions = false;
    $scope.showButtonsDefault = true;
    $scope.optionName = "";
    
    
    $scope.addProduct = function() {
      // Get the business id.
      var businessID = sessionService.getClientID();
      $scope.product.businessID = businessID;
      $scope.product.options = $scope.productOptions;
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
        $scope.alertMessage = 'Product was added!';
      });
    };
    
    
    /**
     * @param {string} name - The name of the ProductOption
     * @param {int} index - The index of the product option in the list.
     */
    $scope.newProductOption = function(name) {
      if (name === undefined || name === null || name === "") {
        return;
      }
      // Check that product option doesnt already exsist.
      var optionAlreadyExists = false;
      angular.forEach($scope.productOptions, function(productOption, index) {
        if (productOption.name === name) {
          optionAlreadyExists = true;
        }
      });

      if (!optionAlreadyExists) {
        var productOption = new ProductOption(name);
        $scope.productOptions.push(productOption);
        $scope.newProductOptionName = null;
      }
    };

    $scope.removeProductOption = function(productOption) {
      if (!productOption) { return; }

      angular.forEach($scope.productOptions, function(option, index) {
        if (option === productOption) {
          $scope.productOptions.splice(index, 1);
        }
      });
    };
 
    /** Adds a new ProductOption value.
     * @param {ProductOption} productOption - The ProductOption to add the value to.
     * @param {string} valueName - The name of the value.
     * @param {float} priceDelta - The price delta.
     */
    $scope.addProductOptionValue = function(productOption, valueName, priceDelta) {
      productOption.addValue(valueName, priceDelta);
    };
    
    $scope.removeProductOptionValue = function(productOption, valueName) {
      productOption.removeValue(valueName);
    };
    
    /** Scrolls to the bottom of the page.*/
    function scrollToBottom() {
      $location.hash('bottom');
      $anchorScroll();
    }
  }

})();