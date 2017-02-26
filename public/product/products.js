(function () {
  'use strict';

  angular.module('products')
    .factory('productsService', productsService);

  productsService.inject = ['$http', 'Product', 'ProductOption'];
  function productsService($http, Product, ProductOption) {
    return {
      getProducts: getProducts,
      addProduct: addProduct,
      updateProduct: updateProduct,
      getUpdates: getUpdates,
      removeProduct: removeProduct
    };

    /**
     * Get products for a business.
     * @param {string} businessID - The id of the business.
     * @param {function(err, products)} callback - Callback function.
     */
    function getProducts(businessID, callback) {
      $http.get('/product')
        .success(function (data) {
          parseProductsFromNetworkData(data, function(products) {
            callback(null, products);
          });
        })
        .error(function (data) {
          callback(new Error('Could not retrieve products for business: ' + businessID));
        });
    }

    /**
     * Remove product from backend.
     * @param {object} product - The product with id attribute attached.
     * @param {function(err)} callback - Callback function.
     */
    function removeProduct(product, callback) {
      var productID = product.id;
      $http.delete('/product/' + productID)
        .success(function(data) {
          callback(null);
        })
        .error(function(data) {
          callback(new Error('Could not delete product.'));
        });
    };
    
    /**
     * Attempts to add a product to the database.
     * 
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
     * Parses all products from network request.
     * @param {object} data - The data from the network request.
     * @param {function(products)} callback - Callback function.
     */
    function parseProductsFromNetworkData(data, callback) {
      if (Array.isArray(data.products)) {
        // Parse the ProductOptions back to object.
                
        var products = [];
        // Retrieve each product.
        angular.forEach(data.products, function(product, index) {
          var options = []; // All options for this product.
          
          angular.forEach(product.options, function(option) {
            var option = new ProductOption(option.name, option.values);
            options.push(option);
          });
          var newProduct = new Product(product.id, 
                                       product.name, 
                                       product.price, 
                                       product.businessID, 
                                       product.specifiedID,
                                       options, 
                                       product.description,
                                       product.processing,
                                       product.createdAt);
          products.push(newProduct);  
          if (index === data.products.length - 1) {
            callback(products);
          }                                     
        });
      }
    };

    /**
     * Finds updates(edits) in a product before and after it was edited.
     * 
     * @param {object} productBeforeEdit - The product before edit.
     * @param {object} productAfterEdit - The product after edit.
     * @param {function(err, detectedUpdates, updates)} callback - Callback function.
     */
    function getUpdates(productBeforeEdit, productAfterEdit, callback) {
      if (!productBeforeEdit || !productAfterEdit) {
        return callback(new Error('Product was null'));
      }
      // Bool to determine if the product details were actually edited.
      var productWasEdited = false;

      var updates = {
        id: productBeforeEdit.id,
        updateFields: []
      };
      var EditedField = {
        column: "",
        newValue: ""
      };
      
      // Check the following fields for updates
      // - name
      // - specifiedID
      // - description
      // - price
      if (productAfterEdit.name !== productBeforeEdit.name) {
        var editedName = Object.create(EditedField);
        editedName.column = "name";
        editedName.newValue = productAfterEdit.name;
        updates.updateFields.push(editedName);
        productWasEdited = true;
      }
      if (productAfterEdit.specifiedID !== productBeforeEdit.specifiedID) {
        var editedSpecifiedID = Object.create(EditedField);
        editedSpecifiedID.column = 'specifiedID';
        editedSpecifiedID.newValue = productAfterEdit.specifiedID;
        updates.updateFields.push(editedSpecifiedID);
        productWasEdited = true;
      }
      if (productAfterEdit.description !== productBeforeEdit.description) {
        var editedDescription = Object.create(EditedField);
        editedDescription.column = 'description';
        editedDescription.newValue = productAfterEdit.description;
        updates.updateFields.push(editedDescription);
        productWasEdited = true;
      }
      if (productAfterEdit.price !== productBeforeEdit.price) {
        var editedPrice = Object.create(EditedField);
        editedPrice.column = 'price';
        editedPrice.newValue = productAfterEdit.price;
        updates.updateFields.push(editedPrice);
        productWasEdited = true;
      }
      if (JSON.stringify(productAfterEdit.options) !== JSON.stringify(productBeforeEdit.options)) {
        var editedOptions = Object.create(EditedField);
        editedOptions.column = 'options';
        editedOptions.newValue = productAfterEdit.options;
        updates.updateFields.push(editedOptions);
        productWasEdited = true;
      }

      if (productWasEdited) {
        return callback(null, true, updates);
      } else {
        return callback(null, false, productBeforeEdit);
      }
    }
  }
})();