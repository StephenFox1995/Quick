var app = angular.module('authenticate', []);

app.controller('signInController', function ($scope, $http) {
  $scope.signInData = {};
  $scope.message = "";

  $scope.authenticate = function () {
    console.log($scope);
    $http.post('/signIn', $scope.signInData)
      .success(function (data) {
        if (data.success) {
          $scope.message = data.responseMessage;
        }
      })
      .error(function (data) {
        $scope.message = data.responseMessage;
      });
  };
});