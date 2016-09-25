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
      generateHTTPBodyForProductUpdate: generateHTTPBodyForProductUpdate
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
      $http.patch('/product', product)
      .success(function (data) {
        callback(null, data);
      }).error(function (data) {
        callback(new Error('There was an error updating the product.'));
      });
    }

    /**
     * Generates the HTTP body needed for updating
     * a product in the database.
     * 
     * @param {object} productBeforeEdit - The product before edit.
     * @param {object} productAfterEdit - The product after edit.
     * @return {object} The HTTP body containing the changed fields.
     */
    function generateHTTPBodyForProductUpdate(productBeforeEdit, productAfterEdit) {
      if (productBeforeEdit == null || productAfterEdit == null) {
        return {};
      }

      var editedProduct = {
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
        var editedName = new EditedField();
        editedName.column = "name";
        editedName.newValue = productAfterEdit.name;
        editedProduct.updateFields.push(editedName);
      }
      if (productAfterEdit.specifiedID !== productBeforeEdit.specifiedID) {
        var editedSpecifiedID = new EditedField();
        editedSpecifiedID.column = 'specifiedID';
        editedSpecifiedID.newValue = productAfterEdit.specifiedID;
        editedProduct.updateFields.push(editedSpecifiedID);
      }
      if (productAfterEdit.description !== productBeforeEdit.description) {
        var editedDescription = new EditedField();
        editedDescription.column = 'description';
        editedDescription.newValue = productAfterEdit.description;
        editedProduct.updateFields.push(editedDescription);
      }
      if (productAfterEdit.price !== productBeforeEdit.price) {
        var editedPrice = new EditedField();
        editedPrice.column = 'price';
        editedPrice.newValue = productAfterEdit.price;
        editedProduct.updateFields.push(editedPrice);
      }
    }
  }
})();