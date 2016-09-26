(function () {
  'use strict';

  angular.module('products', [])
    .factory('productsService', productsService);

  productsService.inject = ['$http'];
  function productsService($http) {
    return {
      getProducts: getProducts,
      addProduct: addProduct,
      updateProduct: updateProduct,
      getChanges: getChanges
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

    /**
     * Attempts to update a product in the database.
     * @param {Object} data - The product data.
     * @param {function(err, data)} callback - Callback function.
     */
    function updateProduct(data, callback) {
      $http.patch('/product', data)
      .success(function (data) {
        callback(null, data);
      }).error(function (data) {
        callback(new Error('There was an error updating the product.'));
      });
    }

    /**
     * Finds changes in a product before and after it was edited.
     * 
     * @param {object} productBeforeEdit - The product before edit.
     * @param {object} productAfterEdit - The product after edit.
     * @param {function(err, detectedChanges, changes)} callback - Callback function.
     */
    function getChanges(productBeforeEdit, productAfterEdit, callback) {
      if (productBeforeEdit == null || productAfterEdit == null) {
        return callback(new Error('Product was null'));
      }
      // Bool to determine if the product details were actually edited.
      var productWasEdited = false;

      var changes = {
        id: productBeforeEdit.id,
        updateFields: []
      };
      var EditedField = {
        column: "",
        newValue: ""
      };
      
      // Check the following fields for change
      // - name
      // - specifiedID
      // - description
      // - price
      if (productAfterEdit.name !== productBeforeEdit.name) {
        var editedName = Object.create(EditedField);
        editedName.column = "name";
        editedName.newValue = productAfterEdit.name;
        changes.updateFields.push(editedName);
        productWasEdited = true;
      }
      if (productAfterEdit.specifiedID !== productBeforeEdit.specifiedID) {
        var editedSpecifiedID = Object.create(EditedField);
        editedSpecifiedID.column = 'specifiedID';
        editedSpecifiedID.newValue = productAfterEdit.specifiedID;
        changes.updateFields.push(editedSpecifiedID);
        productWasEdited = true;
      }
      if (productAfterEdit.description !== productBeforeEdit.description) {
        var editedDescription = Object.create(EditedField);
        editedDescription.column = 'description';
        editedDescription.newValue = productAfterEdit.description;
        changes.updateFields.push(editedDescription);
        productWasEdited = true;
      }
      if (productAfterEdit.price !== productBeforeEdit.price) {
        var editedPrice = Object.create(EditedField);
        editedPrice.column = 'price';
        editedPrice.newValue = productAfterEdit.price;
        changes.updateFields.push(editedPrice);
        productWasEdited = true;
      }

      if (productWasEdited) {
        return callback(null, true, changes);
      } else {
        return callback(null, false, productBeforeEdit);
      }
    }
  }
})();