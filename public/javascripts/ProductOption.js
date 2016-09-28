(function () {
  'use strict';

  angular.module('products', [])
    .factory('ProductOption', ProductOptionClass);

  // Wraps ProductOption class. 
  function ProductOptionClass() {
    return ProductOption;

    /** Constructor for ProductOption.
   * @param {string} name - The name of the ProductOption.
   */
    function ProductOption(name) {
      this.name = name;
    };

    // The name of the option e.g. color.
    ProductOption.prototype.name = "";

    /**
     * ProductOption values are the many values an
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
    ProductOption.prototype.values = [];

    // See ProductOption.prototype.values documentation for more info.
    ProductOption.prototype.value = {};
    ProductOption.prototype.value.name = "";
    ProductOption.prototype.value.priceDelta = 0;

    ProductOption.prototype.addValue = function (name, priceDelta = 0) {
      var newProductOptionValue = Object.create(ProductOption.prototype.value);
      newProductOptionValue.name = name;
      newProductOptionValue.priceDelta = priceDelta;
      this.values.push(newProductOptionValue);
    };
  }
})();