(function () {
  'use strict';

  angular.module('products')
    .factory('ProductOption', ProductOptionsObject);


  function ProductOptionsObject() {
    /**
     * Information on values.
     * Values are the many values an
     * option can have e.g. one product option may be
     * color for a pair of shoes. A pair of shoes can have
     * many colors, therefore the color option can have many
     * values e.g. red, blue, green etc.
     * Each value can also have an associated price delta.
     * So for example let's say the default model cost €65.00. 
     * The red shoes are special rare edition and have a price
     * delta of + 20.00 euros. This means the price of the shoes in
     * the red color are €85.00. (default model + red color). 
     */


    /**
     * Constructor for ProductOption.
     * Construct a new ProductOption object with an array of values.
     * @param {string} name - Name of the ProductOption.
     * @param {array} values - Array of values.
     */
    function ProductOption(name, values) {
      this.name = name;
      this.values = values || [];
    }

  
    /**
     * Adds a product option value to the values array.
     * If a value already exists with the same
     * name then it will not be added.
     * @param {string} name - The name of the value.
     * @param {float} priceDelta - The price delta.
     */
    ProductOption.prototype.addValue = function (name, priceDelta) {
      if (name === undefined || name === null || name === "") {
        return;
      }
      if (priceDelta === undefined || priceDelta === null || priceDelta === "") {
        return;
      }
      var value = {
        name: "",
        priceDelta: 0
      };
      var newProductOptionValue = value;
      newProductOptionValue.name = name;
      newProductOptionValue.priceDelta = priceDelta;

      // Check it hasn't been added before.
      var valueAlreadyExists = false;
      angular.forEach(this.values, function(value, index) {
        if (value.name === name) {
          valueAlreadyExists = true;
        }
      }, this);
      
      // Add new value.
      if (!valueAlreadyExists) {
        this.values.push(newProductOptionValue);
      } 
    };


    ProductOption.prototype.removeValue = function(name) {
      angular.forEach(this.values, function(value, index) {
        if (value.name === name) {
          this.values.splice(index, 1);
        }
      }, this);
    };
    return ProductOption;
  };
})();