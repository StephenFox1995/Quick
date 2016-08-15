var app = angular.module('signUp', []);

app.controller('signUpController',
  ['$scope',
    'signUpServices',
    function ($scope, signUpServices) {
      $scope.httpBody = {};
      $scope.message = '';
      $scope.signUpModel = {};

      $scope.signUp = function () {
        if (!$scope.signUpModel.endPoint) { return; }
        var endPoint = $scope.signUpModel.endPoint;

        // Begin sign up process.
        signUpServices.signUp(endPoint, $scope.httpBody, function (reponse) {
          signUpServices.verifyResponse(reponse, function (success, message) {
            if (success) {
              // Log user in etc.
              $scope.message = message;
            } else {
              // Display message.
              $scope.message = message;
            }
          });
        });
      };
    }
  ]);


/**
 * Use this service for sign up procedures for both users and businesses.
 * */
app.factory('signUpServices', ['$http', function ($http) {
  return {
    signUp: function (endPoint, httpBody, callback) {
      $http.post(endPoint, httpBody)
        .success(function (response) {
          callback(response);
        })
        .error(function (response) {
          callback(response);
        });
    },

    verifyResponse: function (response, callback) {
      if (response.success) {
        // Successful sign up.
        return callback(true, response.responseMessage);
      } else {
        // Failed to sign up.
        return callback(false, response.responseMessage);
      }
    }
  }
}]);