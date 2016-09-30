(function () {
  'use strict';

  angular.module('businessProducts')
    .factory('ProductOption', ProductOptionsObject);


  function ProductOptionsObject() {
    /** Constructor for ProductOption.
   * @param {string} name - The name of the ProductOption.
   */
    function ProductOption(name) {
      this.name = name;
      this.values = [];
    };

    // The name of the option e.g. color.
    ProductOption.prototype.name = "";

    /**
     * ProductOption.prototype.values are the many values an
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

    ProductOption.prototype.addValue = function (name, priceDelta) {
      var value = {
        name: "",
        priceDelta: 0
      };
      var newProductOptionValue = value;
      newProductOptionValue.name = name;
      newProductOptionValue.priceDelta = priceDelta;
      this.values.push(newProductOptionValue);
    };

    return ProductOption;
  };
})();