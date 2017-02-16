(() => {
  angular.module('products')
  .controller('ProductsCreationController', ProductsCreationController);

  /**
   * ProductsCreationController is the default controller
   * for creating Products.
   */
  ProductsCreationController.inject = ['$scope', 'productsService', 'sessionService'];
  function ProductsCreationController($scope, productsService, sessionService) {
    const lScope = $scope;
    lScope.product = {
      options: [],
    };
    lScope.httpBody = {
      product: {},
    };
    lScope.showAlert = false;
    lScope.addProduct = () => {
      // Get the business id.
      const businessID = sessionService.getClientID();
      lScope.product.businessID = businessID;
      lScope.product.processing *= 60;
      // Get copy of product.
      angular.copy(lScope.product, lScope.httpBody.product);

      productsService.addProduct(lScope.httpBody, (err) => {
        if (err) {
          lScope.showAlert = true;
          lScope.alertStyle = 'danger';
          lScope.alertTitle = 'Error';
          lScope.alertMessage = 'There was a problem trying to add the product, please try again.';
          return;
        }
        lScope.showAlert = true;
        lScope.alertStyle = 'success';
        lScope.alertTitle = 'Success';
        lScope.alertMessage = 'Product was added!';
      });
    };
  }
})();

