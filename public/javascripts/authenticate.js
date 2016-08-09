var app = angular.module('authenticate', []);

app.controller('authenticateController', function ($scope, $http) {
  $scope.signInData = {};
  $scope.message = "";

  $scope.authenticate = function () {
    console.log($scope);
    $http.post('/authenticate', $scope.signInData)
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