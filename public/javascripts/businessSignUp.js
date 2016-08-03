var app = angular.module('businessSignUp', []);

app.controller('businessSignUpController', function ($scope, $http) {
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