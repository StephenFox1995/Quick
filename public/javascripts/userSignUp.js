var app = angular.module('signUp', []);

app.controller('userSignUpController', ['$scope', '$http', 'accountCreationResponse', function ($scope, $http, accountCreationResponse) {
  $scope.httpBody = {};
  $scope.message = '';


  $scope.createAccount = function () {
    $http.post('/user', $scope.httpBody)
      .success(function (data) {
        // Verify the account creation response.
        accountCreationResponse.verifyResponse(data, function (verified, message) {
          if (verified) {
            // Log user in etc.
            $scope.message = message;
          } else {
            $scope.message = message;
          }
        });
      })
      .error(function () {
        $scope.message = "Account creation error.";
      });
  }
}]);


app.factory('accountCreationResponse', function () {
  return {
    verifyResponse: function (response, callback) {
      if (response.type) {
        return callback(true, response.responseMessage);
      } else {
        // Failed to create account.
        return callback(false, response.responseMessage);
      }
    }
  }
});
