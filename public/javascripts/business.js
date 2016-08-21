var app = angular.module('business', []);

app.controller('productsController', function ($scope, $http) {
  $scope.products = [];
  $scope.newProduct = {};

  var businessID = 'rkIeje2r';
  $http.get('/business/' + businessID + '/products')
    .success(function (data) {
      $scope.products = data.products;
    })
    .error(function (data) {

      
    });

  $scope.newProduct.businessID = businessID;
  $scope.addProduct = function () {
    $http.post('/product', $scope.newProduct)
      .success(function (data) {
        $scope.message = 'Success';
      })
      .error(function (data) {
        $scope.message = 'Error';
      });
  }
});