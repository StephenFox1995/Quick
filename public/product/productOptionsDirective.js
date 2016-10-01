(function () {
  'use strict';

  angular.module('products')
  .directive('productOptions', productOptions);

  productOptions.inject = ['ProductOption'];
  function productOptions(ProductOption) {
    return {
      restrict: 'E',
      scope: {
        product: "="
      },
      templateUrl: '/product/productOptionsDirective.html',
      controller: Controller,
      link: link
    };

    function link($scope, elem, attrs) {
      // Add options property to product.
      $scope.product.options = [];
    }

    function Controller($scope) {

      $scope.newProductOption = function (name) {
        if (name === undefined || name === null || name === "") {
          return;
        }
        // Check that product option doesnt already exsist.
        var optionAlreadyExists = false;
        angular.forEach($scope.product.options, function (productOption, index) {
          if (productOption.name === name) {
            optionAlreadyExists = true;
          }
        });

        if (!optionAlreadyExists) {
          var productOption = new ProductOption(name);
          $scope.product.options.push(productOption);
          $scope.newProductOptionName = null;
        }
      };

      $scope.removeProductOption = function (productOption) {
        if (!productOption) { return; }

        angular.forEach($scope.product.options, function (option, index) {
          if (option === productOption) {
            $scope.product.options.splice(index, 1);
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