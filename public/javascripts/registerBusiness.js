var app = angular.module('registerBusiness', []);

app.controller('registerBusinessController', function ($scope, $http) {
  $scope.businessData = {};

  $scope.registerBusiness = function () {
    $http.post('/business', $scope.businessData)
      .success(function (data) {
        $scope.message = "Success!";
        window.location.href = 'http://localhost:3000/views/business';
      })
      .error(function (data) {
        $scope.message = "Account creation error.";
      });
  }
});