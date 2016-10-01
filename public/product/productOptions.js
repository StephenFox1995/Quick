(function () {
  'use strict';

  angular.module('products')
  .directive('productOptions', productOptions);

  productOptions.inject = ['ProductOption'];
  function productOptions(ProductOption) {
    return {
      restrict: 'E',
      require: '^',
      templateUrl: '/product/productOptions.html',
      controller: Controller
    };

    function Controller($scope) {
      // All Product Options.
      $scope.productOptions = [];

      $scope.newProductOption = function (name) {
        if (name === undefined || name === null || name === "") {
          return;
        }
        // Check that product option doesnt already exsist.
        var optionAlreadyExists = false;
        angular.forEach($scope.productOptions, function (productOption, index) {
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

      $scope.removeProductOption = function (productOption) {
        if (!productOption) { return; }

        angular.forEach($scope.productOptions, function (option, index) {
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
      $scope.addProductOptionValue = function (productOption, valueName, priceDelta) {
        productOption.addValue(valueName, priceDelta);
      };

      $scope.removeProductOptionValue = function (productOption, valueName) {
        productOption.removeValue(valueName);
      };
    }
  };
})();