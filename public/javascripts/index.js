var app = angular.module('root', []);

app.controller('index', function ($scope, $http) {
  $scope.createAccountData = {};

  $scope.createAccount = function () {
    $http.post('/user', $scope.createAccountData)
      .success(function (data) {
        $scope.message = "Success!";
      })
      .error(function (data) {
        $scope.message = "Account creation error.";
      });
  }
});