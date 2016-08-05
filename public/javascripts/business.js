var app = angular.module('business', []);

app.controller('productsController', function ($scope, $http) {
  $scope.products = [];
  var businessID = 'rkIeje2r';
  $http.get('/business/' + businessID + '/products')
    .success(function (data) {
      $scope.products = data.products;
    })
    .error(function (data) {
  })
});