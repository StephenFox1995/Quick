(function () {
  'use strict';

  angular.module('products')
  .directive('productOptions', productOptions);

  productOptions.inject = ['ProductOption'];
  function productOptions(ProductOption) {
    return {
      restrict: 'E',
      scope: {
        options: "="
      },
      templateUrl: '/product/productOptionsDirective.html',
      controller: Controller
    };


    function Controller($scope) {
      $scope.newProductOption = function (name) {
        if (!name || name === "") {
          return;
        }
        // Check that product option doesn't already exsist.
        var optionAlreadyExists = false;
        angular.forEach($scope.options, function (productOption, index) {
          if (productOption.name === name) {
            optionAlreadyExists = true;
          }
        });

        if (!optionAlreadyExists) {
          var productOption = new ProductOption(name);
          $scope.options.push(productOption);
          $scope.newProductOptionName = null;
        }
      };

      $scope.removeProductOption = function (productOption) {
        if (!productOption) { return; }

        angular.forEach($scope.options, function (option, index) {
          if (option === productOption) {
            $scope.options.splice(index, 1);
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