var app = angular.module('signUp', []);

app.controller('signUpController', function ($scope, $http) {
  $scope.userData = {};

  $scope.createAccount = function () {
    $http.post('/user', $scope.userData)
      .success(function (data) {
        $scope.message = "Success!";
      })
      .error(function (data) {
        $scope.message = "Account creation error.";
      });
  }
});