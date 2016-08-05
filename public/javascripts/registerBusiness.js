var app = angular.module('registerBusiness', []);

app.controller('registerBusinessController', function ($scope, $http) {
  $scope.businessData = {};

  $scope.registerBusiness = function () {
    $http.post('/business', $scope.businessData)
      .success(function (data) {
        $scope.message = "Success!";
      })
      .error(function (data) {
        $scope.message = "Account creation error.";
      });
  }
});